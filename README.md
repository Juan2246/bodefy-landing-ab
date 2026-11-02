# Bodefy · Landing A/B

Prototipo académico del curso **Technical Sales & Marketing**, UPC 2026, Laboratorio 8. Bodefy conecta la lista del comprador con las bodegas de su barrio en Lima. **«Tú pides, tu barrio responde».**

Sitio estático, desarrollado con HTML, CSS y JavaScript vanilla. No requiere compilación, dependencias, cuentas ni servidor de aplicación. Todos los recursos visuales son HTML, CSS y SVG escritos en código; Google Fonts es el único recurso externo.

## Páginas

- [Entrada con asignación A/B](index.html)
- [Versión A: Orden y presupuesto](a/)
- [Versión B: Pregunta + calculadora interactiva](b/)
- [Comparador para la presentación](comparar.html)
- Forzar una variante: `index.html?v=a` o `index.html?v=b`.

La entrada asigna A o B aleatoriamente con probabilidad 50/50 y conserva la selección en `localStorage.bodefy_variant`. Una variante forzada también se conserva. Si el navegador bloquea el almacenamiento, la redirección funciona sin persistencia. Los enlaces directos a `a/` y `b/` permiten revisar ambas sin cambiar la asignación guardada. Sin JavaScript, la entrada conserva enlaces visibles; las interacciones del planificador y Bodi requieren JavaScript.

## Uso local y publicación

Desde esta carpeta, ejecutar `python -m http.server 8080 --bind 127.0.0.1` y abrir `http://127.0.0.1:8080/comparar.html`. Detener con Ctrl+C. Usar HTTP local para mantener un origen coherente para el almacenamiento; `file://` puede tratarlo de forma diferente en cada navegador.

Para GitHub Pages, publicar los archivos tal cual, conservando la estructura, desde la raíz de la rama elegida. `.nojekyll` evita el procesamiento de Jekyll. Las rutas de archivos son relativas y admiten el subdirectorio `https://juan2246.github.io/bodefy-landing-ab/`. No hay claves, integraciones ni compilación pendiente.

## Experiencia

**A, control:** propuesta «Organiza tu compra. Cuida tu presupuesto.», formulario en el hero, beneficios, tres pasos, celular construido con HTML/CSS, testimonios, FAQ y CTA final.

**B, variante:** pregunta «¿Cuánto se te va en la bodega cada semana?», presupuesto de S/ 30 a S/ 200, productos que se agregan o retiran, controles de cantidad y boleta en vivo. El formulario aparece después de demostrar el valor. El saldo negativo se identifica en rojo y con texto explicativo.

Ambas ofrecen el **Planificador de compras y presupuesto semanal**, validación por campo, política de privacidad, modal editable «¡Tu lista está lista!», descarga `.txt` con Blob y mensaje de cotización futura. B conserva la lista y el presupuesto de la calculadora. A empieza con el ejemplo del brief. Las cantidades se pueden ajustar entre 0 y 50 por producto; 0 retira el producto y el botón + lo vuelve a agregar.

**Bodi** responde las cinco FAQ, reconoce palabras clave en texto libre, muestra una respuesta de respaldo y dirige al formulario. Su saludo aparece a los seis segundos, una vez por sesión del navegador (`sessionStorage.bodefy_bodi_greeted`). No utiliza IA remota ni envía conversaciones.

## Datos y transparencia

- Presupuesto inicial: **S/ 60.00**. Arroz, 2 kg × S/ 4.50 = S/ 9.00; aceite, 1 botella de 1 L = S/ 8.50; leche, 2 unidades × S/ 4.00 = S/ 8.00; huevos, 1 docena = S/ 10.00; azúcar, 1 kg = S/ 4.00. **Total S/ 39.50; saldo S/ 20.50.**
- Cálculos de productos en céntimos para evitar errores de decimales.
- El formulario guarda registros en `localStorage.bodefy_leads` con nombre, correo, distrito, consentimiento, variante, fecha ISO, presupuesto y lista al enviar. Las ediciones posteriores afectan la vista y la descarga, no el registro original de captación.
- No se envían leads, listas ni conversaciones a servidores. El correo no recibe mensajes. Si el almacenamiento está bloqueado o lleno, se informa al usuario y la descarga sigue disponible.
- Los datos se eliminan desde las opciones del navegador para este sitio. No introducir información sensible en un prototipo compartido.
- Las cotizaciones no se envían: el botón muestra «Enviaremos tu lista a las bodegas de {distrito} cuando el piloto esté activo».
- Los precios son referenciales. Los tres testimonios son ficticios y están rotulados. Las cifras del piloto de B son simuladas para la presentación; no son resultados de uso real.

## Ficha del experimento A/B

| Elemento | Definición |
| --- | --- |
| Hipótesis | Interactuar con una calculadora antes de entregar los datos incrementa la tasa de formularios completados frente al mensaje de orden y presupuesto con formulario inmediato. |
| Variable | Experiencia de entrada completa: mensaje, estructura y presencia de calculadora previa al formulario. |
| Control | Versión A: orden y presupuesto; formulario en el hero. |
| Variante | Versión B: pregunta e interacción primero; formulario posterior. |
| Elementos compartidos | Lead magnet, precios, campos, distritos, privacidad, planificador final y chatbot. |
| Asignación | Aleatoria 50/50, persistente por navegador. No garantiza grupos de idéntico tamaño. |
| Métrica principal | Visitantes únicos con formulario válido / visitantes únicos asignados a la variante × 100. |
| Métricas secundarias | Inicio del formulario, errores de validación, descarga, solicitud de cotización simulada y abandono entre calculadora y formulario. |

Se compara un conjunto de cambios. Una diferencia de conversión no demostraría por sí sola que el título, la calculadora o la ubicación del formulario sea la causa individual.

### Cómo se mediría

1. Definir antes del lanzamiento el público, la duración, la conversión base y la mejora mínima relevante; calcular la muestra necesaria con potencia estadística acordada. Evitar decidir un ganador por fluctuaciones tempranas.
2. Registrar, con un identificador anónimo persistente y la variante asignada, `landing_view`, `form_start`, `lead_submit`, `list_download` y `quote_request`. Registrar la conversión solo después de validar y una sola vez por visitante para la métrica principal. No incluir nombre, correo ni distrito en eventos analíticos.
3. Excluir pruebas internas, parámetros `?v=`, accesos directos de revisión y vistas de los iframes de `comparar.html`. Mantener fuentes de tráfico y periodo comparables y revisar el reparto 50/50.
4. Comparar tasas A/B, diferencia absoluta, mejora relativa e intervalo de confianza; revisar la calidad y los errores antes de concluir.
5. Implementar la medición real y los avisos de privacidad correspondientes antes de un piloto público. **Este sitio no incorpora analítica remota ni cuenta visitas.** Los leads guardados localmente sirven para demostrar el flujo, pero no permiten calcular una tasa global ni deduplicar personas entre dispositivos.

## Archivos

```text
index.html
comparar.html
a/index.html
a/style.css
b/index.html
b/style.css
assets/base.css
assets/chatbot.js
assets/planner.js
assets/motion.js
assets/compare.css
assets/compare.js
assets/logo.svg
assets/favicon.svg
.nojekyll
README.md
```

`motion.js` separa revelados, contadores e impresión de la boleta; `compare.css` y `compare.js` mantienen la presentación independiente de las landings. Cada archivo tiene menos de 800 líneas. El comparador renderiza vistas de 1280 px en escritorio y de 390 px en celular, escaladas visualmente cuando el panel es más estrecho.

## Accesibilidad

Etiquetas reales, errores asociados con `aria-describedby`, estados en vivo, foco visible, enlace para saltar al contenido, controles táctiles, diálogos nativos con Escape y retorno del foco, FAQ nativa con `details`, y respeto de `prefers-reduced-motion`. Los contenidos permanecen visibles sin animaciones o si no existe `IntersectionObserver`.

## Validación realizada

- Sintaxis de los cuatro archivos JavaScript comprobada con `node --check`.
- 74 comprobaciones de integración sobre el HTML y JavaScript reales en un DOM de prueba: formularios, almacenamiento, precios, edición, descarga TXT, cotizaciones simuladas, Bodi, comparador y asignación A/B. Todas pasaron, sin errores JavaScript capturados. Las herramientas temporales de prueba se retiraron; no son dependencias del sitio.
- Recursos locales y estructura revisados; auditoría estática de CSS para 360, 390, 768, 1024 y 1440 px, y correcciones de contraste y tamaños táctiles.
- Revisión visual en navegador (escritorio 1366 px y celular 375 px): sin scroll horizontal, formulario con validaciones, Momento WOW, chatbot Bodi, divisor A/B y comparador funcionando, sin errores en consola.
