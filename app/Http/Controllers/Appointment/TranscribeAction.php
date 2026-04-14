<?php

namespace App\Http\Controllers\Appointment;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\SessionRecording;
use App\Services\KosmoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TranscribeAction extends Controller
{
    public function __invoke(Request $request, Appointment $appointment, KosmoService $kosmo): JsonResponse
    {
        $request->validate([
            'audio' => ['required', 'file', 'mimes:mp3,mp4,webm,ogg,wav,m4a'],
        ]);

        $path = $request->file('audio')->store('recordings', 'local');

        $recording = SessionRecording::firstOrCreate(
            ['appointment_id' => $appointment->id],
            ['audio_path' => $path, 'transcription_status' => 'pending'],
        );

        $recording->update([
            'audio_path'           => $path,
            'transcription_status' => 'pending',
        ]);

        // @todo Dispatch Groq Whisper transcription job
        // TranscribeRecording::dispatch($recording);

        return response()->json(['status' => 'queued', 'recording_id' => $recording->id]);
    }
}
