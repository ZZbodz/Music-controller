from django.shortcuts import render, redirect
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .utils import *
from urllib.parse import urlencode
from django.urls import reverse
from api.models import Room
from .models import Votes
from django.http import JsonResponse

# Create your views here.


class AuthURL(APIView):
    def get(self, request, format=None):
        # scopes are the permissions that we are giving to the user
        scopes = "playlist-read-private playlist-read-collaborative playlist-modify-public playlist-modify-private user-library-read user-library-modify user-read-private user-read-email user-top-read user-read-recently-played user-follow-read user-follow-modify user-read-playback-state user-modify-playback-state user-read-currently-playing"

        # this is the url that we are going to redirect the user to
        url = (
            Request(
                "GET",
                "https://accounts.spotify.com/authorize",
                params={
                    "scope": scopes,
                    "response_type": "code",
                    "redirect_uri": REDIRECT_URI,
                    "client_id": CLIENT_ID,
                },
            )
            .prepare()
            .url
        )
        return Response({"url": url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    # this is the code that we are going to get from the url
    code = request.GET.get("code")
    error = request.GET.get("error")

    response = post(
        "https://accounts.spotify.com/api/token",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECT_URI,
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET,
        },
    ).json()

    access_token = response.get("access_token")
    token_type = response.get("token_type")
    refresh_token = response.get("refresh_token")
    expires_in = response.get("expires_in")
    error = response.get("error")

    if not request.session.exists(request.session.session_key):
        if request.session.get("room_code"):
            # If the session key doesn't exist and there is a room code in the session, redirect to the frontend
            return redirect(
                reverse(
                    "frontend:room",
                    kwargs={"room_code": request.session.get("room_code")},
                )
            )
        else:
            request.session.create()

    update_or_create_user_tokens(
        request.session.session_key, access_token, token_type, expires_in, refresh_token
    )

    return redirect("frontend:")


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({"status": is_authenticated}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):
        room_code = self.request.session.get("room_code")
        room = Room.objects.filter(code=room_code)

        if room.exists():
            room = room[0]
            host = room.host
            endpoint = "player/currently-playing"
            response = execute_spotify_api_request(host, endpoint)

            if response is not None and "item" in response:
                item = response["item"]
                duration = item["duration_ms"]
                progress = response["progress_ms"]
                album_cover = item["album"]["images"][0]["url"]
                is_playing = response["is_playing"]
                song_id = item["id"]

                # Get the artist names
                artist_string = ""

                for i, artist in enumerate(item["artists"]):
                    if i > 0:
                        artist_string += ", "
                    name = artist["name"]
                    artist_string += name

                votes = len(Votes.objects.filter(room=room, song_id=song_id))

                song = {
                    "title": item["name"],
                    "artist": artist_string,
                    "duration": duration,
                    "time": progress,
                    "image_url": album_cover,
                    "is_playing": is_playing,
                    "votes": votes,
                    "votes_required": room.votes_to_skip,
                    "id": song_id,
                }

                self.update_room_song(room, song_id)
                return Response(song, status=status.HTTP_200_OK)
            else:
                return Response({}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({}, status=status.HTTP_404_NOT_FOUND)

    def update_room_song(self, room, song_id):
        current_song = room.current_song

        if current_song != song_id:
            room.current_song = song_id
            room.save(update_fields=["current_song"])
            votes = Votes.objects.filter(room=room, song_id=song_id)

            if votes.exists():
                votes.delete()


class PauseSong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get("room_code")
        room = Room.objects.filter(code=room_code)

        if room.exists():
            room = room[0]
            if self.request.session.session_key == room.host or room.guest_can_pause:
                pause_song(room.host)
                return Response({}, status=status.HTTP_204_NO_CONTENT)

            return Response({}, status=status.HTTP_204_NO_CONTENT)


class PlaySong(APIView):
    def put(self, response, format=None):
        room_code = self.request.session.get("room_code")
        room = Room.objects.filter(code=room_code)

        if room.exists():
            room = room[0]
            if self.request.session.session_key == room.host or room.guest_can_pause:
                play_song(room.host)
                return Response({}, status=status.HTTP_204_NO_CONTENT)

            return Response({}, status=status.HTTP_403_FORBIDDEN1)


class SkipSong(APIView):
    def post(self, request, format=None):
        room_code = self.request.session.get("room_code")
        room = Room.objects.filter(code=room_code)
        votes = Votes.objects.filter(room=room, song_id=room.current_song)
        votes_needed = room.votes_to_skip

        if room.exists():
            room = room[0]
            if (
                self.request.session.session_key == room.host
                or room.guest_can_pause
                or votes.count() + 1 >= votes_needed
            ):
                votes.delete()
                skip_song(room.host)
                return Response({}, status=status.HTTP_204_NO_CONTENT)
            else:
                vote = Votes(
                    user=self.request.session.session_key,
                    room=room,
                    song_id=room.current_song,
                )
                vote.save()

            return Response({}, status=status.HTTP_403_FORBIDDEN1)
