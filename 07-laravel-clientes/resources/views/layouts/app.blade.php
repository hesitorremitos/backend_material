<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Clientes') — {{ config('app.name', 'Clientes') }}</title>
    <style>
        body { font-family: system-ui, sans-serif; margin: 0; background: #f4f5f7; color: #1b1b18; }
        header { background: #1b1b18; color: #fff; padding: 0.75rem 1.25rem; display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
        header a { color: #fff; text-decoration: none; }
        nav { display: flex; gap: 1rem; align-items: center; }
        main { max-width: 52rem; margin: 1.5rem auto; padding: 0 1rem 2rem; }
        .card { background: #fff; border: 1px solid #e3e3e0; border-radius: 8px; padding: 1.25rem; }
        label { display: block; font-weight: 600; margin-top: 0.75rem; }
        input[type="text"], input[type="email"], input[type="password"] { width: 100%; box-sizing: border-box; padding: 0.5rem; margin-top: 0.25rem; }
        button, .btn { display: inline-block; background: #1b1b18; color: #fff; border: 0; padding: 0.45rem 0.8rem; border-radius: 4px; text-decoration: none; cursor: pointer; font: inherit; }
        .btn-danger { background: #9b1c1c; }
        .btn-quiet { background: transparent; color: #1b1b18; border: 1px solid #ccc; }
        .error { color: #9b1c1c; font-size: 0.9rem; margin: 0.2rem 0 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td { text-align: left; padding: 0.5rem; border-bottom: 1px solid #e3e3e0; vertical-align: top; }
        .actions { display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; }
        .actions form { margin: 0; }
        .row { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
    </style>
</head>
<body>
<header>
    <a href="{{ url('/') }}"><strong>{{ config('app.name', 'Clientes') }}</strong></a>
    <nav>
        @auth
            <a href="{{ route('clientes.index') }}">Clientes</a>
            <span>{{ auth()->user()->name }}</span>
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit">Salir</button>
            </form>
        @else
            <a href="{{ route('login') }}">Entrar</a>
            <a href="{{ route('register') }}">Registrarse</a>
        @endauth
    </nav>
</header>
<main>
    @yield('content')
</main>
</body>
</html>
