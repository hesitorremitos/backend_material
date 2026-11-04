@extends('layouts.app')

@section('title', 'Editar cliente')

@section('content')
    <div class="card">
        <h1>Editar cliente</h1>
        <form method="POST" action="{{ route('clientes.update', $cliente) }}">
            @csrf
            @method('PUT')
            @include('clientes._form')
            <p class="actions">
                <button type="submit">Actualizar</button>
                <a class="btn btn-quiet" href="{{ route('clientes.index') }}">Cancelar</a>
            </p>
        </form>
    </div>
@endsection
