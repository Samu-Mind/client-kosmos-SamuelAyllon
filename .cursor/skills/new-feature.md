# Receta: añadir una feature completa en ClientKosmos

Usa este skill cuando necesites implementar una feature que implique backend + frontend.
Adjúntalo con `@new-feature.md` al inicio de la conversación.

---

## Los 7 pasos en orden

Si saltas un paso, el siguiente falla silenciosamente (ej: sin Policy → `403`, sin ruta nombrada → Ziggy lanza excepción).

### 1. Migración

```bash
php artisan make:migration add_campo_to_tabla_table
```

- Nunca editar una migración ya ejecutada — siempre crear una nueva.
- Si el cambio afecta a un modelo con `user_id`, revisar el Observer correspondiente.

### 2. Modelo

Añadir el campo en `$fillable` y el tipo en el cast si procede:

```php
// app/Models/Patient.php
protected $fillable = [..., 'nuevo_campo'];
protected $casts = ['nuevo_campo' => 'boolean'];  // si aplica
```

### 3. Policy (si el modelo tiene ownership por user_id)

```php
// app/Policies/PatientPolicy.php — añadir método si es una acción nueva
public function nuevaAccion(User $user, Patient $patient): bool
{
    return $user->id === $patient->user_id;
}
```

### 4. FormRequest (solo para escritura: store, update)

```php
// app/Http/Requests/StoreNuevoRecursoRequest.php
public function rules(): array
{
    return [
        'campo' => ['required', 'string', 'max:255'],
    ];
}
```

### 5. Single Action Controller

```php
// app/Http/Controllers/Dominio/StoreAction.php
class StoreAction extends Controller
{
    public function __invoke(StoreNuevoRecursoRequest $request, Patient $patient): RedirectResponse
    {
        $this->authorize('create', $patient);  // ← Policy primero

        $patient->nuevoRecurso()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Recurso creado.');
    }
}
```

### 6. Ruta nombrada

```php
// routes/web.php — dentro del grupo middleware 'professional'
Route::post('/patients/{patient}/nuevo-recurso',
    NuevoRecursoStoreAction::class)->name('patients.nuevo-recurso.store');
```

Alias del import en la cabecera del archivo:
```php
use App\Http\Controllers\NuevoRecurso\StoreAction as NuevoRecursoStoreAction;
```

### 7. Página Inertia + tipos TypeScript

**Tipo** (si es un modelo nuevo):
```ts
// resources/js/types/models/patient.ts — añadir al final
export type NuevoRecurso = {
    id: number;
    patient_id: number;
    user_id: number;
    campo: string;
    created_at: string;
    updated_at: string;
};
```

**Actualizar `Patient`** para incluir la relación opcional:
```ts
export type Patient = {
    // ... campos existentes ...
    nuevo_recurso?: NuevoRecurso[];
};
```

**Página o componente**:
```tsx
import { useForm } from '@inertiajs/react';
import type { Patient } from '@/types';

const form = useForm({ campo: '' });

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    form.post(route('patients.nuevo-recurso.store', patient.id));
};
```

---

## Checklist antes de commitear

- [ ] `php artisan migrate` ejecutado localmente
- [ ] `npm run types` sin errores
- [ ] `npm run lint` sin errores
- [ ] `./vendor/bin/pint` ejecutado
- [ ] `php artisan test` — los tests existentes siguen pasando
- [ ] Ruta nombrada añadida y accesible con `route('nombre.accion')`
- [ ] Policy cubre la nueva acción si el recurso tiene `user_id`

---

## Tests — dónde añadirlos

```
tests/Feature/
├── PatientControllerTest.php   ← para acciones sobre pacientes y sus relaciones
├── BillingControllerTest.php   ← para pagos y facturación
├── KosmoControllerTest.php     ← para Kosmo IA
└── AdminControllerTest.php     ← para panel admin
```

Patrón de test existente: autenticación con `actingAs($user)` + `withoutMiddleware` selectivo o seeds de roles.
