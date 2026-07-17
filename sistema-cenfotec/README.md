# Sistema CENFOTEC

Proyecto web hecho con Astro para representar un sistema de egresados de Universidad CENFOTEC. Incluye una pagina publica, pantallas de autenticacion y un panel administrativo con modulos reutilizables para listados, formularios y vistas de detalle.

## Tecnologias

- Astro: framework principal del proyecto.
- TypeScript en archivos `.astro`: se usa en el frontmatter y en algunos scripts del navegador.
- CSS modular: los estilos estan separados por responsabilidad en `src/styles`.
- `@lucide/astro`: libreria de iconos usados en botones, menus, tarjetas y formularios.
- `@fontsource/inter`: fuente tipografica del sistema.

## Comandos del proyecto

Los comandos estan definidos en `package.json`.

```bash
pnpm dev
```

Levanta el servidor local de desarrollo con `astro dev`.

```bash
pnpm build
```

Genera la version estatica del sitio en la carpeta `dist` con `astro build`.

```bash
pnpm preview
```

Sirve localmente la version generada en `dist` para revisar el resultado final.

```bash
pnpm astro
```

Permite ejecutar comandos directos del CLI de Astro.

## Estructura del proyecto

```text
sistema-cenfotec/
├── public/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── icons/
│   ├── images/
│   └── logos/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── egresados/
│   │   ├── forms/
│   │   └── layout/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── astro.config.mjs
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── tsconfig.json
```

## Carpetas principales

`public/` contiene archivos estaticos que se sirven directamente desde la raiz del sitio. Aqui estan los logos, imagenes, favicon e iconos SVG.

`src/pages/` contiene las rutas del proyecto. En Astro cada archivo `.astro` dentro de `pages` crea una pagina. Por ejemplo, `src/pages/dashboard.astro` genera `/dashboard` y `src/pages/titulos/crear.astro` genera `/titulos/crear`.

`src/layouts/` contiene estructuras base de pagina. `Main.astro` se usa para el panel administrativo y `AuthLayout.astro` para login, soporte y cambio de contrasena.

`src/components/` contiene piezas reutilizables. Los componentes administrativos permiten crear pantallas parecidas sin repetir todo el HTML.

`src/styles/` contiene CSS global y CSS por secciones. `global.css` importa o concentra la base visual del proyecto.

## Layouts

### `src/layouts/Main.astro`

Es el layout de las pantallas internas del sistema.

- Importa `Sidebar` para mostrar el menu lateral.
- Importa `global.css` para aplicar estilos generales.
- Define la interfaz `Props` con `title?: string`.
- La variable `title` viene de `Astro.props`. Si una pagina no envia titulo, usa `"Sistema CENFOTEC"`.
- El `<slot />` representa el contenido que cada pagina inserta dentro del layout.

Script inline:

- `savedTheme`: lee de `localStorage` el tema guardado por el usuario.
- `prefersDark`: revisa si el sistema operativo prefiere modo oscuro con `window.matchMedia`.
- `document.documentElement.dataset.theme`: asigna el tema al elemento `<html>`.
- Condicional: `savedTheme ?? (prefersDark ? "dark" : "light")`.
  - Si existe `savedTheme`, usa ese valor.
  - Si no existe, revisa `prefersDark`.
  - Si `prefersDark` es verdadero, usa `"dark"`.
  - Si es falso, usa `"light"`.

### `src/layouts/AuthLayout.astro`

Es el layout para pantallas publicas de autenticacion.

- Importa `global.css`.
- Define `Props` con `title?: string`.
- `title` funciona igual que en `Main.astro`.
- Usa `<slot />` para insertar el contenido del login, soporte o cambio de contrasena.
- Tiene el mismo script de tema que `Main.astro`.

## Componentes de layout

### `src/components/layout/Header.astro`

Renderiza el encabezado superior del panel administrativo.

Variables y props:

- `Props`: define `title?: string` y `subtitle?: string`.
- `title`: titulo principal visible de la pagina. Valor por defecto: `"Egresados"`.
- `subtitle`: texto descriptivo bajo el titulo. Valor por defecto: `"Gestion de egresados"`.
- `themeToggle`: boton que cambia entre tema claro y oscuro.
- `root`: referencia a `document.documentElement`, es decir, el `<html>`.

Funcion:

- `updateThemeToggle()`: sincroniza el boton con el tema actual.
  - `isDark`: verifica si `root.dataset.theme === "dark"`.
  - Actualiza `aria-pressed` para indicar si el boton esta activo.
  - Actualiza `aria-label` para que lectores de pantalla sepan si el boton activara modo claro u oscuro.

Condicionales:

- `root.dataset.theme === "dark"` decide si el tema actual es oscuro.
- `isDark ? "Activar modo claro" : "Activar modo oscuro"` cambia el texto accesible del boton.
- En el evento `click`, `nextTheme` alterna entre `"light"` y `"dark"`.

Evento:

- `themeToggle?.addEventListener("click", ...)`: cuando el usuario da clic, cambia el tema, lo guarda en `localStorage` y vuelve a llamar `updateThemeToggle()`.

### `src/components/layout/Sidebar.astro`

Renderiza el menu lateral del panel administrativo.

Variables:

- `currentPath`: guarda la ruta actual con `Astro.url.pathname`.
- `isActive(path)`: funcion que recibe una ruta y devuelve `true` si la ruta actual coincide o empieza con esa ruta.
- `sidebar`: referencia al elemento `#sidebar`.
- `toggle`: boton de colapsar o expandir el menu en escritorio.
- `mobileToggle`: boton del menu en pantallas pequenas.

Funcion:

- `isActive(path: string)`: se usa para marcar enlaces activos.
  - Retorna verdadero si `currentPath === path`.
  - Tambien retorna verdadero si `currentPath.startsWith(`${path}/`)`, para que subrutas como `/titulos/crear` mantengan activo `/titulos`.

Condicionales:

- `isActive("/dashboard") ? "page" : undefined`: asigna `aria-current="page"` solo cuando el enlace esta activo.
- `document.body.classList.toggle("sidebar-open", !isCollapsed)`: agrega la clase si el menu esta abierto.
- `isOpen ? "Cerrar menu principal" : "Abrir menu principal"` cambia el texto accesible del boton movil.

Eventos:

- Clic en `toggle`: alterna la clase `is-collapsed`.
- Clic en `mobileToggle`: alterna la clase `is-mobile-open`.

## Componentes administrativos

### `src/components/admin/ModuleList.astro`

Componente generico para pantallas de listado como actividades, carreras, escuelas, comunicados, comunidades, mentorias y oportunidades.

Interfaces:

- `Stat`: representa una tarjeta de resumen.
  - `label`: nombre de la metrica.
  - `value`: valor principal.
  - `detail`: detalle opcional.
- `RowAction`: representa una accion de fila.
  - `label`: texto del enlace o boton.
  - `href`: destino de la accion.
- `Row`: representa una fila de tabla.
  - `cells`: textos de las columnas.
  - `status`: estado opcional. Puede ser `"Activo"`, `"Inactivo"`, `"Pendiente"`, `"Publicado"`, `"Borrador"` o `"Cerrado"`.
  - `action`: accion opcional.
- `Props`: define toda la configuracion que recibe el listado.

Variables:

- `title`: titulo del modulo.
- `description`: descripcion corta.
- `createHref`: ruta para crear un nuevo registro.
- `createLabel`: texto del boton de creacion.
- `searchPlaceholder`: texto del campo de busqueda.
- `stats`: arreglo de metricas.
- `filters`: arreglo de filtros.
- `columns`: nombres de columnas.
- `rows`: datos de la tabla.

Funciones y recorridos:

- `stats.map(...)`: crea una tarjeta por cada metrica.
- `filters.map(...)`: crea un campo por cada filtro.
- `columns.map(...)`: crea encabezados de tabla.
- `rows.map(...)`: crea filas de tabla.
- `row.cells.map(...)`: crea celdas por cada fila.

Condicionales:

- `{stat.detail && <small>{stat.detail}</small>}`: muestra el detalle solo si existe.
- `index === 0 ? <th scope="row">{cell}</th> : <td>{cell}</td>`: la primera celda de cada fila se marca como encabezado de fila.
- `{row.status && (...)}`: muestra la etiqueta de estado solo si la fila tiene estado.
- `row.action ? (...) : (...)`: si hay accion configurada, muestra enlace; si no, muestra un boton generico "Ver".

### `src/components/admin/ModuleForm.astro`

Componente generico para formularios de creacion y configuracion.

Interfaz `Field`:

- `label`: texto visible del campo.
- `type`: tipo de input. Puede ser texto, email, telefono, fecha, url, numero, archivo, textarea o select.
- `placeholder`: texto de ayuda.
- `options`: opciones para campos select.
- `required`: marca el campo como obligatorio.
- `accept`: define tipos de archivo aceptados.
- `min`: valor minimo para fechas o numeros.
- `pattern`: patron de validacion HTML.

Props:

- `backHref`: ruta de regreso.
- `title`: titulo del formulario.
- `description`: descripcion visible.
- `submitLabel`: texto del boton de envio. Si no se envia, usa `"Guardar"`.
- `sections`: arreglo de secciones, cada una con `title` y `fields`.

Funciones y recorridos:

- `sections.map(...)`: crea un `fieldset` por cada seccion.
- `section.fields.map(...)`: crea un campo por cada definicion.
- `field.options?.map(...)`: crea opciones de un `select`, si existen.

Condicionales:

- `field.type === "textarea"`: renderiza un `<textarea>`.
- `field.type === "select"`: renderiza un `<select>`.
- Si no es textarea ni select, renderiza un `<input>`.
- `field.type ?? "text"`: si no se define tipo, usa `text`.
- `{ "is-wide": field.type === "textarea" }`: agrega clase especial a campos largos.

### `src/components/admin/ProfileView.astro`

Componente generico para vistas de detalle.

Props:

- `backHref`: ruta de regreso.
- `title`: nombre principal del registro.
- `subtitle`: texto secundario.
- `status`: estado del registro.
- `email`: correo opcional.
- `phone`: telefono opcional.
- `facts`: datos resumidos laterales.
- `sections`: secciones de detalle.

Variables:

- `statusClass`: construye una clase CSS con el estado en minuscula: `is-${status.toLowerCase()}`.

Funciones y recorridos:

- `title.slice(0, 1)`: toma la primera letra del titulo para el avatar.
- `facts.map(...)`: renderiza datos resumidos.
- `sections.map(...)`: renderiza secciones.
- `section.items.map(...)`: renderiza pares de etiqueta y valor.

Condicionales:

- `{email && (...)}`: muestra enlace de correo solo si existe `email`.
- `{phone && (...)}`: muestra enlace telefonico solo si existe `phone`.

## Componentes de egresados

### `src/components/egresados/EgresadosToolbar.astro`

Renderiza controles superiores de la pantalla de egresados.

Props y variables:

- `dateValue`: fecha inicial del filtro. Por defecto `"2026-07-03"`.
- `minDate`: fecha minima permitida. Por defecto `"2026-01-01"`.
- `maxDate`: fecha maxima permitida. Por defecto `"2026-12-31"`.

Uso:

- El input de fecha usa esas variables en `value`, `min` y `max`.
- Incluye enlaces a nueva busqueda, perfil destacado y creacion de egresado.

### `src/components/egresados/EgresadosTable.astro`

Renderiza la tabla especializada de egresados.

Interfaz `Graduate`:

- `id`: identificador del egresado.
- `name`: nombre completo.
- `email`: correo.
- `phone`: telefono.
- `career`: carrera.
- `school`: escuela.
- `program`: tipo de programa academico.

Props y variables:

- `graduates`: arreglo de egresados recibido desde `src/pages/egresados.astro`.

Funciones y recorridos:

- `graduates.map(...)`: crea una fila por cada egresado.

## Formulario de login

### `src/components/forms/LoginForm.astro`

Renderiza el formulario de inicio de sesion.

Elementos principales:

- Selector de rol.
- Campo de usuario.
- Campo de contrasena con `minlength="6"`.
- Checkbox de recordarme.
- Enlace de soporte.
- Boton que envia el formulario a `/dashboard` con metodo `get`.

No tiene funciones JavaScript propias; usa validaciones HTML como `required` y `minlength`.

## Paginas principales

### `src/pages/index.astro`

Es la landing publica del programa de egresados.

Script de tema:

- `savedTheme`: tema guardado en navegador.
- `prefersDark`: preferencia del sistema.
- `dataset.theme`: aplica tema claro u oscuro.
- Condicional: si no hay tema guardado, usa la preferencia del sistema.

Script de navegacion publica:

- `publicNav`: elemento principal de navegacion.
- `publicToggle`: boton para abrir o cerrar menu en mobile.
- `publicNavLinks`: todos los enlaces del menu publico.
- `setCurrentPublicNavLink()`: funcion que marca el enlace activo segun el hash de la URL.
- `currentTarget`: hash actual de la URL. Si no hay hash, usa `#inicio`.
- `linkUrl`: convierte cada `href` en un objeto `URL`.
- `isCurrentPath`: verdadero si el enlace apunta a la misma ruta y no tiene hash.
- `isCurrentHash`: verdadero si el enlace apunta a la misma ruta y al hash actual.

Condicionales:

- `window.location.hash || "#inicio"`: si no hay ancla activa, asume inicio.
- `if (isCurrentPath || isCurrentHash)`: agrega `aria-current="page"` al enlace activo.
- `else`: elimina `aria-current` de los demas enlaces.
- `isOpen ? "Cerrar menu" : "Abrir menu"`: cambia el texto accesible del boton mobile.

Eventos:

- `hashchange`: recalcula el enlace activo cuando cambia el ancla.
- Clic en `publicToggle`: abre o cierra el menu.
- Clic en cada enlace: cierra el menu movil despues de navegar.

### `src/pages/dashboard.astro`

Renderiza el resumen general del sistema.

Variables:

- `today`: fecha actual.
- `currentHour`: hora actual.
- `greeting`: saludo segun la hora.
- `todayLabel`: fecha formateada para Costa Rica.
- `todayIso`: fecha en formato ISO corto para atributos HTML.
- `quickActions`: accesos rapidos a modulos.
- `stats`: metricas generales.
- `upcomingActivities`: actividades proximas.
- `careerChart`: datos simulados para barras por carrera.
- `roles`: descripcion de roles del sistema.

Condicionales:

- `currentHour < 12 ? "Buenos dias" : currentHour < 18 ? "Buenas tardes" : "Buenas noches"`:
  - Antes de mediodia muestra `"Buenos dias"`.
  - Desde mediodia y antes de las 6 p.m. muestra `"Buenas tardes"`.
  - Despues muestra `"Buenas noches"`.

Recorridos:

- `quickActions.map(...)`: pinta accesos rapidos.
- `stats.map(...)`: pinta tarjetas de metricas.
- `upcomingActivities.map(...)`: pinta agenda.
- `careerChart.map(...)`: pinta barras.
- `roles.map(...)`: pinta tarjetas de roles.

### `src/pages/egresados.astro`

Renderiza la pantalla de gestion de egresados.

Variables:

- `graduates`: arreglo de datos simulados con tipo `Graduate[]`.

Uso:

- Pasa `graduates` a `<EgresadosTable graduates={graduates} />`.
- Usa `<EgresadosToolbar />` para filtros y acciones superiores.

### `src/pages/titulos.astro`

Renderiza la gestion de titulos academicos.

Variables:

- `titles`: arreglo de titulos simulados.
- Cada titulo tiene `name`, `career`, `school`, `level` y `status`.

Recorridos y condicionales:

- La pagina recorre `titles` para renderizar filas de tabla.
- El estado se usa para aplicar estilos visuales segun si esta activo o inactivo.

## Paginas de modulos administrativos

Estas paginas usan `ModuleList.astro` con datos diferentes:

- `src/pages/actividades.astro`: calendario de actividades.
- `src/pages/carreras.astro`: gestion de carreras.
- `src/pages/comunicados.astro`: gestion de comunicados.
- `src/pages/comunidades.astro`: gestion de comunidades.
- `src/pages/escuelas.astro`: gestion de escuelas.
- `src/pages/mentorias.astro`: gestion de mentorias.
- `src/pages/oportunidades.astro`: oportunidades laborales.

Cada una configura:

- `title`: titulo del modulo.
- `description`: descripcion.
- `createHref`: ruta para crear.
- `createLabel`: texto del boton.
- `searchPlaceholder`: texto del buscador.
- `stats`: tarjetas de resumen.
- `filters`: campos de filtro.
- `columns`: columnas de tabla.
- `rows`: registros visibles.

## Paginas de creacion

Estas paginas usan `ModuleForm.astro`:

- `src/pages/actividades/crear.astro`
- `src/pages/carreras/crear.astro`
- `src/pages/comunicados/crear.astro`
- `src/pages/comunidades/crear.astro`
- `src/pages/egresados/crear.astro`
- `src/pages/escuelas/crear.astro`
- `src/pages/mentorias/crear.astro`
- `src/pages/oportunidades/crear.astro`
- `src/pages/titulos/crear.astro`

Cada pagina define:

- `backHref`: a donde volver.
- `title`: titulo del formulario.
- `description`: descripcion del formulario.
- `submitLabel`: texto del boton final.
- `sections`: secciones y campos del formulario.

## Paginas de detalle

Estas paginas usan `ProfileView.astro`:

- `src/pages/actividades/detalle.astro`
- `src/pages/carreras/detalle.astro`
- `src/pages/comunicados/detalle.astro`
- `src/pages/comunidades/detalle.astro`
- `src/pages/egresados/perfil.astro`
- `src/pages/escuelas/detalle.astro`
- `src/pages/mentorias/detalle.astro`
- `src/pages/oportunidades/detalle.astro`
- `src/pages/titulos/detalle.astro`

Cada pagina envia:

- `backHref`: ruta de regreso.
- `title`: nombre del registro.
- `subtitle`: descripcion corta.
- `status`: estado.
- `facts`: datos laterales resumidos.
- `sections`: informacion detallada.
- Opcionalmente `email` y `phone`.

## Paginas de autenticacion

### `src/pages/login.astro`

Usa `AuthLayout` y `LoginForm`. Es la entrada al sistema.

### `src/pages/cambiar-contrasena.astro`

Muestra un formulario visual para cambiar contrasena. Usa iconos de llave y candado.

### `src/pages/soporte-login.astro`

Muestra informacion y formulario de soporte para problemas de acceso.

## Estilos

Los estilos estan divididos para facilitar mantenimiento:

- `variables.css`: variables de color, sombras, radios y valores reutilizables.
- `typography.css`: tipografia base.
- `layout.css`: estructura general.
- `utilities.css`: clases utilitarias.
- `components.css`: estilos compartidos de componentes.
- `components/admin.css`: listados, formularios y detalles administrativos.
- `components/dashboard.css`: dashboard.
- `components/egresados.css`: pantalla de egresados.
- `components/header.css`: encabezado interno.
- `components/sidebar.css`: menu lateral.
- `components/landing.css`: landing publica.
- `components/login-form.css`: login.
- `components/buttons.css` y `components/cards.css`: botones y tarjetas.

## Flujo general del sistema

1. El usuario entra a `/`.
2. Desde la landing puede ir a `/login`.
3. El formulario de login envia a `/dashboard`.
4. El dashboard muestra resumen y accesos rapidos.
5. El menu lateral permite navegar entre modulos administrativos.
6. Los modulos reutilizan componentes genericos:
   - Listados con `ModuleList`.
   - Formularios con `ModuleForm`.
   - Detalles con `ProfileView`.

## Notas importantes del codigo

- El proyecto usa datos simulados dentro de los archivos `.astro`; no hay conexion a backend todavia.
- Los formularios son visuales y usan validaciones HTML, pero no guardan datos en una base de datos.
- Los botones de editar, eliminar, exportar y filtrar estan preparados visualmente, pero no tienen logica conectada.
- El tema claro/oscuro si tiene logica real con `localStorage` y `data-theme`.
- La navegacion activa del sidebar depende de `Astro.url.pathname`.
- La navegacion activa de la landing depende de `window.location.hash`.

