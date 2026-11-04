@extends('layouts.app')

@section('title', 'Nuevo cliente')

@section('content')
    <div class="card">
        <h1>Nuevo cliente</h1>
        <form method="POST" action="{{ route('clientes.store') }}">
            @csrf
            @include('clientes._form')
            <p class="actions">
                <button type="submit">Guardar</button>
                <a class="btn btn-quiet" href="{{ route('clientes.index') }}">Cancelar</a>
            </p>
        </form>
    </div>
@endsection
