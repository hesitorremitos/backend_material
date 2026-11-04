<?php

namespace Tests\Feature;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientesTest extends TestCase
{
    use RefreshDatabase;

    public function test_invitado_es_enviado_a_login(): void
    {
        $this->get('/clientes')->assertRedirect('/login');
    }

    public function test_registro_y_login(): void
    {
        $this->post('/register', [
            'name' => 'Ana',
            'email' => 'ana@mail.com',
            'password' => 'Secreta123!',
            'password_confirmation' => 'Secreta123!',
        ])->assertRedirect();

        $this->assertAuthenticated();
        $this->assertNotEquals('Secreta123!', User::first()->password);

        $this->post('/logout');
        $this->assertGuest();

        $this->post('/login', ['email' => 'ana@mail.com', 'password' => 'mala'])
            ->assertSessionHasErrors('email');

        $this->post('/login', ['email' => 'ana@mail.com', 'password' => 'Secreta123!'])
            ->assertRedirect();

        $this->assertAuthenticated();
    }

    public function test_registro_invalido(): void
    {
        $this->post('/register', [
            'name' => '',
            'email' => 'ana@',
            'password' => '1',
            'password_confirmation' => '2',
        ])->assertSessionHasErrors(['name', 'email', 'password']);
    }

    public function test_usuario_autenticado_lista_crea_y_elimina_cliente(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)->get('/clientes')->assertOk();

        $this->post('/clientes', [
            'nombre' => 'Luis',
            'email' => 'luis@mail.com',
            'telefono' => '70012345',
        ])->assertRedirect(route('clientes.index'));

        $cliente = Cliente::first();
        $this->assertNotNull($cliente);
        $this->get("/clientes/{$cliente->id}")->assertOk();

        $this->put("/clientes/{$cliente->id}", [
            'nombre' => 'Luis P',
            'email' => 'luis@mail.com',
        ])->assertRedirect(route('clientes.index'));

        $this->assertEquals('Luis P', $cliente->fresh()->nombre);

        $this->delete("/clientes/{$cliente->id}")->assertRedirect(route('clientes.index'));
        $this->assertDatabaseCount('clientes', 0);
    }

    public function test_validacion_rechaza_correo_invalido_y_duplicado(): void
    {
        $user = User::factory()->create();
        Cliente::create(['nombre' => 'A', 'email' => 'a@mail.com']);

        $this->actingAs($user)
            ->post('/clientes', ['nombre' => 'Ana', 'email' => 'no-es-correo'])
            ->assertSessionHasErrors('email');

        $this->actingAs($user)
            ->post('/clientes', ['nombre' => '', 'email' => 'a@mail.com', 'telefono' => '12ab'])
            ->assertSessionHasErrors(['nombre', 'email', 'telefono']);

        $this->assertDatabaseCount('clientes', 1);
    }
}
