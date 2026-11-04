@extends('layouts.app')

@section('title', $cliente->nombre)

@section('content')
    <div class="card">
        <h1>{{ $cliente->nombre }}</h1>
        <p><strong>Correo:</strong> {{ $cliente->email }}</p>
        <p><strong>Teléfono:</strong> {{ $cliente->telefono ?: '—' }}</p>
        <p class="actions">
            <a class="btn" href="{{ route('clientes.edit', $cliente) }}">Editar</a>
            <a class="btn btn-quiet" href="{{ route('clientes.index') }}">Volver</a>
        </p>
    </div>
@endsection
