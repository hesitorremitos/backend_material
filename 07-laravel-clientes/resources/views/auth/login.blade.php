@extends('layouts.app')

@section('title', 'Entrar')

@section('content')
    <div class="card">
        <h1>Entrar</h1>
        <form method="POST" action="{{ route('login') }}">
            @csrf
            <label for="email">Correo</label>
            <input id="email" type="email" name="email" value="{{ old('email') }}" required autofocus>
            @error('email')
                <p class="error">{{ $message }}</p>
            @enderror

            <label for="password">Contraseña</label>
            <input id="password" type="password" name="password" required>
            @error('password')
                <p class="error">{{ $message }}</p>
            @enderror

            <p><button type="submit">Entrar</button></p>
        </form>
        <p>¿No tienes cuenta? <a href="{{ route('register') }}">Regístrate</a></p>
    </div>
@endsection
