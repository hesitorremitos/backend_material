@extends('layouts.app')

@section('title', 'Inicio')

@section('content')
    <div class="card">
        <h1>Gestión de clientes</h1>
        <p>Ejemplo de clase: Laravel, SQLite y autenticación por sesión (registro, login y hash de contraseña).</p>
        @auth
            <p><a class="btn" href="{{ route('clientes.index') }}">Ir a clientes</a></p>
        @else
            <p class="actions">
                <a class="btn" href="{{ route('register') }}">Crear cuenta</a>
                <a class="btn btn-quiet" href="{{ route('login') }}">Ya tengo cuenta</a>
            </p>
        @endauth
    </div>
@endsection
