@extends('layouts.app')

@section('title', 'Registro')

@section('content')
    <div class="card">
        <h1>Crear cuenta</h1>
        <form method="POST" action="{{ route('register') }}">
            @csrf
            <label for="name">Nombre</label>
            <input id="name" type="text" name="name" value="{{ old('name') }}" required autofocus>
            @error('name')
                <p class="error">{{ $message }}</p>
            @enderror

            <label for="email">Correo</label>
            <input id="email" type="email" name="email" value="{{ old('email') }}" required>
            @error('email')
                <p class="error">{{ $message }}</p>
            @enderror

            <label for="password">Contraseña</label>
            <input id="password" type="password" name="password" required>
            @error('password')
                <p class="error">{{ $message }}</p>
            @enderror

            <label for="password_confirmation">Confirmar contraseña</label>
            <input id="password_confirmation" type="password" name="password_confirmation" required>

            <p><button type="submit">Registrarse</button></p>
        </form>
        <p>¿Ya tienes cuenta? <a href="{{ route('login') }}">Entra</a></p>
    </div>
@endsection
