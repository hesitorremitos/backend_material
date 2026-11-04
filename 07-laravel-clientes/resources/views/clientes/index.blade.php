@extends('layouts.app')

@section('title', 'Clientes')

@section('content')
    <div class="card">
        <div class="row">
            <h1>Clientes</h1>
            <a class="btn" href="{{ route('clientes.create') }}">Nuevo cliente</a>
        </div>

        @if ($clientes->isEmpty())
            <p>Todavía no hay clientes.</p>
        @else
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Teléfono</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($clientes as $cliente)
                        <tr>
                            <td>{{ $cliente->nombre }}</td>
                            <td>{{ $cliente->email }}</td>
                            <td>{{ $cliente->telefono }}</td>
                            <td class="actions">
                                <a href="{{ route('clientes.show', $cliente) }}">Ver</a>
                                <a href="{{ route('clientes.edit', $cliente) }}">Editar</a>
                                <form method="POST" action="{{ route('clientes.destroy', $cliente) }}">
                                    @csrf
                                    @method('DELETE')
                                    <button class="btn-danger" type="submit">Eliminar</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
            {{ $clientes->links() }}
        @endif
    </div>
@endsection
