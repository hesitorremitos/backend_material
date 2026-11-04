<label for="nombre">Nombre</label>
<input id="nombre" type="text" name="nombre" value="{{ old('nombre', $cliente->nombre ?? '') }}" required>
@error('nombre')
    <p class="error">{{ $message }}</p>
@enderror

<label for="email">Correo</label>
<input id="email" type="email" name="email" value="{{ old('email', $cliente->email ?? '') }}" required>
@error('email')
    <p class="error">{{ $message }}</p>
@enderror

<label for="telefono">Teléfono</label>
<input id="telefono" type="text" name="telefono" value="{{ old('telefono', $cliente->telefono ?? '') }}">
@error('telefono')
    <p class="error">{{ $message }}</p>
@enderror
