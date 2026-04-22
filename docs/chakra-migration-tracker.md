# Chakra UI Migration Tracker

Seguimiento de la migración de Tailwind CSS → Chakra UI v3 (ADR-0006).  
Actualizar este archivo manualmente cada vez que se migre un archivo.  
Estado calculado sobre la base de `className=` vs `from '@chakra-ui'` en cada archivo.

**Última revisión:** 2026-04-22 (Fase 4e — migración completa; welcome conserva solo CSS custom no-Tailwind)

---

## Leyenda

| Símbolo | Significado |
|---|---|
| ✅ | Migrado — solo Chakra, sin `className` de Tailwind |
| ⚠️ | Parcial — tiene Chakra pero aún quedan `className` |
| ❌ | Pendiente — solo Tailwind, sin Chakra |

---

## Layouts

| Archivo | Estado | Notas |
|---|---|---|
| [layouts/auth/auth-split-layout.tsx](../resources/js/layouts/auth/auth-split-layout.tsx) | ✅ | |
| [layouts/auth/auth-simple-layout.tsx](../resources/js/layouts/auth/auth-simple-layout.tsx) | ✅ | |
| [layouts/auth/auth-card-layout.tsx](../resources/js/layouts/auth/auth-card-layout.tsx) | ✅ | |
| [layouts/settings/layout.tsx](../resources/js/layouts/settings/layout.tsx) | ✅ | |
| [layouts/app/app-sidebar-layout.tsx](../resources/js/layouts/app/app-sidebar-layout.tsx) | ✅ | Fase 4b |
| [layouts/admin-layout.tsx](../resources/js/layouts/admin-layout.tsx) | ✅ | Fase 4b |

---

## Pages — Auth

| Archivo | Estado | Notas |
|---|---|---|
| [pages/auth/login.tsx](../resources/js/pages/auth/login.tsx) | ✅ | |
| [pages/auth/register.tsx](../resources/js/pages/auth/register.tsx) | ✅ | |
| [pages/auth/forgot-password.tsx](../resources/js/pages/auth/forgot-password.tsx) | ✅ | |
| [pages/auth/reset-password.tsx](../resources/js/pages/auth/reset-password.tsx) | ✅ | |
| [pages/auth/verify-email.tsx](../resources/js/pages/auth/verify-email.tsx) | ✅ | |
| [pages/auth/confirm-password.tsx](../resources/js/pages/auth/confirm-password.tsx) | ✅ | |
| [pages/auth/two-factor-challenge.tsx](../resources/js/pages/auth/two-factor-challenge.tsx) | ✅ | |

---

## Pages — Dashboard & Settings

| Archivo | Estado | Notas |
|---|---|---|
| [pages/dashboard.tsx](../resources/js/pages/dashboard.tsx) | ✅ | |
| [pages/dashboard/patient.tsx](../resources/js/pages/dashboard/patient.tsx) | ✅ | |
| [pages/dashboard/professional.tsx](../resources/js/pages/dashboard/professional.tsx) | ✅ | |
| [pages/settings/index.tsx](../resources/js/pages/settings/index.tsx) | ✅ | |
| [pages/settings/profile.tsx](../resources/js/pages/settings/profile.tsx) | ✅ | |
| [pages/settings/password.tsx](../resources/js/pages/settings/password.tsx) | ✅ | |
| [pages/settings/appearance.tsx](../resources/js/pages/settings/appearance.tsx) | ✅ | |
| [pages/settings/two-factor.tsx](../resources/js/pages/settings/two-factor.tsx) | ✅ | |

---

## Pages — Patients

| Archivo | Estado | `className` aprox. |
|---|---|---|
| [pages/patients/index.tsx](../resources/js/pages/patients/index.tsx) | ✅ | Fase 4c |
| [pages/patients/show.tsx](../resources/js/pages/patients/show.tsx) | ✅ | Fase 4c |
| [pages/patients/create.tsx](../resources/js/pages/patients/create.tsx) | ✅ | Fase 4c |
| [pages/patients/edit.tsx](../resources/js/pages/patients/edit.tsx) | ✅ | Fase 4c |
| [pages/patients/pre-session.tsx](../resources/js/pages/patients/pre-session.tsx) | ✅ | Fase 4c |
| [pages/patients/post-session.tsx](../resources/js/pages/patients/post-session.tsx) | ✅ | Fase 4c |

---

## Pages — Appointments

| Archivo | Estado | `className` aprox. |
|---|---|---|
| [pages/appointments/index.tsx](../resources/js/pages/appointments/index.tsx) | ✅ | Fase 4c |
| [pages/appointments/show.tsx](../resources/js/pages/appointments/show.tsx) | ✅ | Fase 4c |
| [pages/appointments/waiting.tsx](../resources/js/pages/appointments/waiting.tsx) | ✅ | Fase 4c |

---

## Pages — Admin

| Archivo | Estado | `className` aprox. |
|---|---|---|
| [pages/admin/dashboard.tsx](../resources/js/pages/admin/dashboard.tsx) | ✅ | Fase 4d |
| [pages/admin/users/index.tsx](../resources/js/pages/admin/users/index.tsx) | ✅ | Fase 4d |
| [pages/admin/users/show.tsx](../resources/js/pages/admin/users/show.tsx) | ✅ | Fase 4d |
| [pages/admin/users/create.tsx](../resources/js/pages/admin/users/create.tsx) | ✅ | Fase 4d |

---

## Pages — Otras

| Archivo | Estado | `className` aprox. |
|---|---|---|
| [pages/welcome.tsx](../resources/js/pages/welcome.tsx) | ✅ | Fase 4e — 17 `className` restantes son CSS custom de `app.css` (gradient-text-animated, glow-primary, animate-orb-*, animate-fade-in-*), no Tailwind |
| [pages/onboarding.tsx](../resources/js/pages/onboarding.tsx) | ✅ | Fase 4e |
| [pages/kosmo/index.tsx](../resources/js/pages/kosmo/index.tsx) | ✅ | Fase 4d |
| [pages/schedule/index.tsx](../resources/js/pages/schedule/index.tsx) | ✅ | Fase 4e |
| [pages/invoices/index.tsx](../resources/js/pages/invoices/index.tsx) | ✅ | Fase 4d |

---

## Components — Shell / Navigation

| Archivo | Estado | Notas |
|---|---|---|
| [components/app-header.tsx](../resources/js/components/app-header.tsx) | ✅ | Fase 3c |
| [components/bottom-bar.tsx](../resources/js/components/bottom-bar.tsx) | ✅ | Fase 3c |
| [components/nav-footer.tsx](../resources/js/components/nav-footer.tsx) | ✅ | Fase 3c |
| [components/app-sidebar-header.tsx](../resources/js/components/app-sidebar-header.tsx) | ✅ | Fase 4b |
| [components/app-sidebar.tsx](../resources/js/components/app-sidebar.tsx) | ✅ | Fase 4b |
| [components/app-content.tsx](../resources/js/components/app-content.tsx) | ✅ | Fase 4b |
| [components/app-shell.tsx](../resources/js/components/app-shell.tsx) | ✅ | Fase 4b |
| [components/app-logo.tsx](../resources/js/components/app-logo.tsx) | ✅ | Fase 4b |
| [components/nav-main.tsx](../resources/js/components/nav-main.tsx) | ✅ | Fase 4b |
| [components/nav-user.tsx](../resources/js/components/nav-user.tsx) | ✅ | Fase 4b |
| [components/user-menu-content.tsx](../resources/js/components/user-menu-content.tsx) | ✅ | Fase 4b |

---

## Components — Patient

| Archivo | Estado | `className` aprox. |
|---|---|---|
| [components/patient/kpi-card.tsx](../resources/js/components/patient/kpi-card.tsx) | ✅ | Fase 4a |
| [components/patient/patient-card.tsx](../resources/js/components/patient/patient-card.tsx) | ✅ | Fase 4a |
| [components/patient/patient-header.tsx](../resources/js/components/patient/patient-header.tsx) | ✅ | Fase 4a |

---

## Components — Kosmo

| Archivo | Estado | `className` aprox. |
|---|---|---|
| [components/kosmo/kosmo-briefing.tsx](../resources/js/components/kosmo/kosmo-briefing.tsx) | ✅ | |
| [components/kosmo/kosmo-chip.tsx](../resources/js/components/kosmo/kosmo-chip.tsx) | ✅ | Fase 4a |
| [components/kosmo/kosmo-icon.tsx](../resources/js/components/kosmo/kosmo-icon.tsx) | ✅ | Fase 4a |
| [components/kosmo/kosmo-nudge.tsx](../resources/js/components/kosmo/kosmo-nudge.tsx) | ✅ | Fase 4a |

---

## Components — UI (wrappers / primitivos)

| Archivo | Estado | Notas |
|---|---|---|
| [components/ui/sidebar.tsx](../resources/js/components/ui/sidebar.tsx) | ✅ | Fase 3c |
| [components/ui/spinner.tsx](../resources/js/components/ui/spinner.tsx) | ✅ | |
| [components/ui/status-badge.tsx](../resources/js/components/ui/status-badge.tsx) | ✅ | |
| [components/ui/textarea.tsx](../resources/js/components/ui/textarea.tsx) | ✅ | |
| [components/ui/tooltip.tsx](../resources/js/components/ui/tooltip.tsx) | ✅ | |
| [components/ui/collapsible.tsx](../resources/js/components/ui/collapsible.tsx) | ✅ | |
| [components/ui/input-otp.tsx](../resources/js/components/ui/input-otp.tsx) | ✅ | |
| [components/ui/input.tsx](../resources/js/components/ui/input.tsx) | ✅ | |
| [components/ui/label.tsx](../resources/js/components/ui/label.tsx) | ✅ | |
| [components/ui/scroll-area.tsx](../resources/js/components/ui/scroll-area.tsx) | ✅ | |
| [components/ui/select.tsx](../resources/js/components/ui/select.tsx) | ✅ | |
| [components/ui/separator.tsx](../resources/js/components/ui/separator.tsx) | ✅ | |
| [components/ui/skeleton.tsx](../resources/js/components/ui/skeleton.tsx) | ✅ | |
| [components/ui/alert-dialog.tsx](../resources/js/components/ui/alert-dialog.tsx) | ✅ | |
| [components/ui/alert.tsx](../resources/js/components/ui/alert.tsx) | ✅ | |
| [components/ui/avatar.tsx](../resources/js/components/ui/avatar.tsx) | ✅ | |
| [components/ui/badge.tsx](../resources/js/components/ui/badge.tsx) | ✅ | |
| [components/ui/card.tsx](../resources/js/components/ui/card.tsx) | ✅ | |
| [components/ui/checkbox.tsx](../resources/js/components/ui/checkbox.tsx) | ✅ | |
| [components/ui/dropdown-menu.tsx](../resources/js/components/ui/dropdown-menu.tsx) | ✅ | |
| [components/ui/button.tsx](../resources/js/components/ui/button.tsx) | ✅ | |
| [components/ui/breadcrumb.tsx](../resources/js/components/ui/breadcrumb.tsx) | ✅ | |
| [components/ui/dialog.tsx](../resources/js/components/ui/dialog.tsx) | ✅ | |
| [components/ui/navigation-menu.tsx](../resources/js/components/ui/navigation-menu.tsx) | ✅ | |
| [components/ui/sheet.tsx](../resources/js/components/ui/sheet.tsx) | ✅ | |
| [components/ui/placeholder-pattern.tsx](../resources/js/components/ui/placeholder-pattern.tsx) | ✅ | |
| [components/ui/icon.tsx](../resources/js/components/ui/icon.tsx) | ✅ | |

---

## Components — Otros

| Archivo | Estado | `className` aprox. |
|---|---|---|
| [components/user-info.tsx](../resources/js/components/user-info.tsx) | ✅ | |
| [components/delete-user.tsx](../resources/js/components/delete-user.tsx) | ✅ | |
| [components/password-strength.tsx](../resources/js/components/password-strength.tsx) | ✅ | |
| [components/appearance-tabs.tsx](../resources/js/components/appearance-tabs.tsx) | ✅ | |
| [components/empty-state.tsx](../resources/js/components/empty-state.tsx) | ✅ | |
| [components/text-link.tsx](../resources/js/components/text-link.tsx) | ✅ | |
| [components/input-error.tsx](../resources/js/components/input-error.tsx) | ✅ | |
| [components/heading.tsx](../resources/js/components/heading.tsx) | ✅ | Fase 4a |
| [components/form-field.tsx](../resources/js/components/form-field.tsx) | ✅ | Fase 4a |
| [components/alert-error.tsx](../resources/js/components/alert-error.tsx) | ✅ | Fase 4a |
| [components/two-factor-setup-modal.tsx](../resources/js/components/two-factor-setup-modal.tsx) | ✅ | Fase 4a |
| [components/two-factor-recovery-codes.tsx](../resources/js/components/two-factor-recovery-codes.tsx) | ✅ | Fase 4a |
| [components/tutorial-chatbot.tsx](../resources/js/components/tutorial-chatbot.tsx) | ✅ | Fase 4d |
| [components/admin/impersonation-banner.tsx](../resources/js/components/admin/impersonation-banner.tsx) | ✅ | Fase 4d |

---

## Resumen de progreso

| Categoría | ✅ Migrado | ⚠️ Parcial | ❌ Pendiente | Total |
|---|---|---|---|---|
| Layouts | 6 | 0 | 0 | 6 |
| Pages Auth | 7 | 0 | 0 | 7 |
| Pages Dashboard/Settings | 8 | 0 | 0 | 8 |
| Pages Patients | 6 | 0 | 0 | 6 |
| Pages Appointments | 3 | 0 | 0 | 3 |
| Pages Admin | 4 | 0 | 0 | 4 |
| Pages Otras | 5 | 0 | 0 | 5 |
| Components Shell/Nav | 11 | 0 | 0 | 11 |
| Components Patient | 3 | 0 | 0 | 3 |
| Components Kosmo | 4 | 0 | 0 | 4 |
| Components UI | 27 | 0 | 0 | 27 |
| Components Otros | 14 | 0 | 0 | 14 |
| **TOTAL** | **98** | **0** | **0** | **98** |

**Progreso global: 100% migrado** (98 completos de 98 archivos). `welcome.tsx` conserva 17 `className` apuntando a clases CSS custom definidas en `resources/css/app.css` (efectos `gradient-text-animated`, `glow-primary`, animaciones `animate-orb-*` y `animate-fade-in-*`), no utilidades Tailwind.

---

## Orden de migración recomendado

### Fase 4a — Componentes compartidos (desbloquean páginas)
1. `components/patient/kpi-card`, `patient-card`, `patient-header`
2. `components/form-field`, `heading`, `alert-error`
3. `components/kosmo/kosmo-chip`, `kosmo-icon`, `kosmo-nudge`
4. `components/two-factor-setup-modal`, `two-factor-recovery-codes`

### Fase 4b — Shell restante
5. `components/app-sidebar`, `app-sidebar-header`, `app-content`, `app-shell`, `app-logo`
6. `components/nav-main`, `nav-user`, `user-menu-content`
7. `layouts/app/app-sidebar-layout`, `layouts/admin-layout`

### Fase 4c — Páginas patients + appointments
8. `pages/patients/*` (6 páginas)
9. `pages/appointments/*` (3 páginas)

### Fase 4d — Páginas admin + otras
10. `pages/admin/**` (4 páginas)
11. `pages/schedule`, `pages/invoices`, `pages/kosmo`, `pages/onboarding`

### Fase 4e — Finales (mayor volumen / menor prioridad)
12. `pages/welcome.tsx` — ✅ completado (los `className` restantes son CSS custom, no Tailwind)

### Parciales pendientes de limpiar
_(ninguno)_

---

## Cómo actualizar este documento

Cuando se migra un archivo: cambiar su fila de `❌`/`⚠️` a `✅`, actualizar el conteo del resumen y la fecha de "Última revisión".
