<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $cliente = $this->route('cliente');

        return [
            'nombre' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255', Rule::unique('clientes')->ignore($cliente)],
            'telefono' => ['nullable', 'digits_between:7,15'],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio.',
            'nombre.max' => 'El nombre no puede superar 100 caracteres.',
            'email.required' => 'El correo es obligatorio.',
            'email.email' => 'El correo no es válido.',
            'email.unique' => 'Ese correo ya está registrado.',
            'telefono.digits_between' => 'El teléfono debe tener entre 7 y 15 dígitos.',
        ];
    }
}
