<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;

abstract class Controller
{
    protected function sendResponse($data, $message, $code = 200)
    {
        return response()->json([
            'success' => true,
            'data' => $data,
            'message' => $message
        ], $code);
    }

    // Método auxiliar para estandarizar respuestas de error
    protected function sendError($error, $errorMessages = [], $code = 404)
    {
        $response = [
            'success' => false,
            'message' => $error,
        ];
        if (!empty($errorMessages)) {
            $response['errors'] = $errorMessages;
        }
        return response()->json($response, $code);
    }

    public function fileUpload(Request $req, $petition_id = null)
    {
        if (!$req->hasFile('files')) {
            return false;
        }
        foreach ($req->file('files') as $file) {
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('petitions', $filename, 'public');

            $fileModel = new File;
            $fileModel->petition_id = $petition_id;
            $fileModel->name = $filename;
            $fileModel->file_path = $path;
            $fileModel->save();
        }
        return true;
    }
}
