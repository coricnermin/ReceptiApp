<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string'
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => bcrypt($fields['password'])
        ]);

        $token = $user->createToken('myapptoken')->plainTextToken;

        return response(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string'
        ]);

        $user = User::where('email', $fields['email'])->first();

        // Check password
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response(['message' => 'Netačan email ili lozinka'], 401);
        }

        $token = $user->createToken('myapptoken')->plainTextToken;

        return response(['user' => $user, 'token' => $token], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response(['message' => 'Odjavljeni ste']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
