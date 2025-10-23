// index.js - WIDGET PHANNIE (Inyección Directa en el Chat)

// **********************************************
// ********* LÓGICA DE PROCESAMIENTO **********
// **********************************************

function updateWidgetPanel(response) {
    const WIDGET_START_TAG = '<WIDGET_DATA>';
    const WIDGET_END_TAG = '</WIDGET_DATA>';

    if (!response.includes(WIDGET_START_TAG)) {
        return response; 
    }

    try {
        // --- Extracción de Datos ---
        const startIndex = response.indexOf(WIDGET_START_TAG) + WIDGET_START_TAG.length;
        const endIndex = response.indexOf(WIDGET_END_TAG);
        const dataBlock = response.substring(startIndex, endIndex).trim();

        const extractValue = (tag) => {
            const regex = new RegExp(`\\*\\*${tag}:\\*\\*\\s*(.*?)(?=\\s*\\*\\*|$)`, 's'); 
            const match = dataBlock.match(regex);
            return match ? match[1].trim() : null;
        };

        const data = {};
        data.pensamientoNormal = extractValue('Pensamiento Normal');
        data.pensamientoRaro = extractValue('Pensamiento Raro');
        data.saldo = extractValue('Saldo');
        
        const transaccionesStr = extractValue('Transacciones');
        data.transacciones = transaccionesStr ? transaccionesStr.split('|').map(t => t.trim()) : [];
        
        const notificacionesStr = extractValue('Notificaciones');
        data.notificaciones = notificacionesStr ? notificacionesStr.split('|').map(n => n.trim()) : [];
        
        const busquedasStr = extractValue('Búsquedas');
        data.busquedas = busquedasStr ? busquedasStr.split('|').map(b => b.trim()) : [];

        // --- Generación de HTML (Styles INLINE usando variables de SillyTavern) ---
        let transaccionesHTML = data.transacciones.map(t => {
            const parts = t.split(';');
            const desc = parts[0].trim();
            const monto = parts.length > 1 ? parts[1].trim() : '';
            const isPositive = monto.includes('+');
            const icon = isPositive ? '🏧' : '☕'; 
            const color = isPositive ? 'var(--SuccessColor)' : 'var(--page-text-color)'; 

            return `
                <li style="display:flex; align-items:center; background:var(--bg3); border:1px solid var(--border-color); border-radius:8px; padding:4px;">
                    <span style="font-size:14px; margin-right:6px;">${icon}</span>
                    <span style="font-weight:600; font-size:12px;">${desc}</span>
                    <span style="font-weight:700; font-size:12px; color:${color}; margin-left:auto;">${monto}</span>
                </li>
            `;
        }).join('');

        let notificacionesHTML = data.notificaciones.map(n => {
             let icon = '💬'; 
             if (n.toLowerCase().includes('instagram') || n.toLowerCase().includes('twitter')) icon = '📸';
             if (n.toLowerCase().includes('recordatorio') || n.toLowerCase().includes('basura')) icon = '⚠️';

            return `<li style="font-size:12px; background:var(--bg3); border:1px solid var(--border-color); border-radius:8px; padding:4px;">${icon} ${n}</li>`;
        }).join('');

        let busquedasHTML = data.busquedas.map(b => {
            return `<li style="font-size:12px; background:var(--bg3); border:1px solid var(--border-color); border-radius:8px; padding:4px;">${b}</li>`;
        }).join('');

        const widgetContent = `
            <div style="
                border: 2px solid var(--HighlightColor); 
                border-radius: 16px; 
                padding: 15px; 
                background: var(--bg2); 
                margin-bottom: 15px;
                box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                color: var(--page-text-color);
                font-family: sans-serif;
            ">
                <h1 style="font-size: 16px; margin: 0 0 10px 0; color: var(--HighlightColor); border-bottom: 1px solid var(--border-color); padding-bottom: 5px;">
                    <i class="fa-solid fa-mobile-screen"></i> WIDGET PHANNIE
                </h1>
                
                <div style="display:flex; flex-direction:column; gap:8px;">
                    <div style="background:var(--bg3); border:1px solid var(--border-color); border-radius:14px; padding:8px;">
                        <h3 style="margin:0 0 4px 0; font-size:13px; font-weight:700;">💭 Pensamientos</h3>
                        <p style="margin:2px 0; font-size:12px; line-height:1.3; color:var(--page-text-color);">${data.pensamientoNormal || '...pensando...'}</p>
                        <p style="margin:2px 0; font-size:12px; opacity:.8;">Raro: ${data.pensamientoRaro || '...cosas raras...'}</p>
                    </div>

                    <div style="background:var(--bg3); border:1px solid var(--border-color); border-radius:14px; padding:8px;">
                        <h3 style="margin:0 0 4px 0; font-size:13px; font-weight:700;">💳 Cartera</h3>
                        <div style="background:var(--bg4); border:1px solid var(--border-color); border-radius:10px; padding:6px; text-align:center; margin-bottom:6px;">
                            <div style="font-size:11px; opacity:.75; font-weight:600;">Saldo</div>
                            <div style="font-size:18px; font-weight:700;">${data.saldo || '$0.00'}</div>
                        </div>
                        <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
                            ${transaccionesHTML || '<li style="font-size:11px; padding:4px; opacity:0.7;">No hay movimientos.</li>'}
                        </ul>
                    </div>
                    
                    <div style="background:var(--bg3); border:1px solid var(--border-color); border-radius:14px; padding:8px;">
                        <h3 style="margin:0 0 4px 0; font-size:13px; font-weight:700;">🔔 Notificaciones</h3>
                        <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
                            ${notificacionesHTML || '<li style="font-size:11px; padding:4px; opacity:0.7;">Bandeja vacía.</li>'}
                        </ul>
                    </div>

                    <div style="background:var(--bg3); border:1px solid var(--border-color); border-radius:14px; padding:8px;">
                        <h3 style="margin:0 0 4px 0; font-size:13px; font-weight:700;">🔎 Búsquedas</h3>
                        <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
                            ${busquedasHTML || '<li style="font-size:11px; padding:4px; opacity:0.7;">No hay historial.</li>'}
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // 2. Devolver el widget HTML + el mensaje limpio del bot
        const textWithoutData = response.replace(new RegExp(`${WIDGET_START_TAG}.*?${WIDGET_END_TAG}`, 's'), '').trim();
        
        // Se añade un <br> extra para una separación clara
        return widgetContent + '<br><br>' + textWithoutData;

    } catch (e) {
        // En caso de error, mostramos un error en el chat y el mensaje original
        const errorContent = `<div style="color: var(--page-text-color); padding:10px; background:var(--ErrorColor); border-radius:10px;">[ERROR DE WIDGET: Revisa el formato de datos del bot o el código HTML de la extensión]</div>`;
        const textWithoutData = response.replace(new RegExp(`${WIDGET_START_TAG}.*?${WIDGET_END_TAG}`, 's'), '').trim();
        return errorContent + '<br><br>' + textWithoutData;
    }
}


// **********************************************
// ************ ESTRUCTURA DEL HOOK ***********
// **********************************************

const extension = {
    name: "WIDGET PHANNIE", 

    onExtensionLoaded: async () => {
        // Solo necesitamos registrar el hook onMessageGeneration
        extension.on('onMessageGeneration', extension.onMessageGeneration);
    },
    
    onMessageGeneration: async (data, chat) => {
        // La función updateWidgetPanel ahora devuelve el HTML del widget + el texto del bot.
        return updateWidgetPanel(data);
    }
};

export { extension };  let icon = '💬'; 
             if (n.toLowerCase().includes('instagram') || n.toLowerCase().includes('twitter')) icon = '📸';
             if (n.toLowerCase().includes('recordatorio') || n.toLowerCase().includes('basura')) icon = '⚠️';
             if (n.toLowerCase().includes('facebook')) icon = '👍';

            return `<li style="font-size:12px; background:#fff; border:1px solid #f2d7e3; border-radius:8px; padding:4px;">${icon} ${n}</li>`;
        }).join('');

        let busquedasHTML = data.busquedas.map(b => {
            return `<li style="font-size:12px; background:#fff; border:1px solid #f2d7e3; border-radius:8px; padding:4px;">${b}</li>`;
        }).join('');

        const widgetContent = `
            <div style="font-family:sans-serif; font-size:12px; display:flex; flex-direction:column; gap:8px;">
                <div style="background:#fff7f9; border:1px solid #f2d7e3; border-radius:14px; padding:8px;">
                    <h3 style="margin:0 0 4px 0; font-size:13px; font-weight:700;">💭 Pensamientos</h3>
                    <p style="margin:2px 0; font-size:12px; line-height:1.3; color:#444;">"${data.pensamientoNormal || '...pensando...'}"</p>
                    <p style="margin:2px 0; font-size:12px; opacity:.8;">Raro: "${data.pensamientoRaro || '...cosas raras...'}"</p>
                </div>

                <div style="background:#fff7f9; border:1px solid #f2d7e3; border-radius:14px; padding:8px;">
                    <h3 style="margin:0 0 4px 0; font-size:13px; font-weight:700;">💳 Cartera</h3>
                    <div style="background:#ffe9f1; border:1px solid #f7c9da; border-radius:10px; padding:6px; text-align:center; margin-bottom:6px;">
                        <div style="font-size:11px; opacity:.75; font-weight:600;">Saldo</div>
                        <div style="font-size:18px; font-weight:700;">${data.saldo || '$0.00'}</div>
                    </div>
                    <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
                        ${transaccionesHTML || '<li style="font-size:11px; padding:4px; opacity:0.7;">No hay movimientos.</li>'}
                    </ul>
                </div>
                
                <div style="background:#fff7f9; border:1px solid #f2d7e3; border-radius:14px; padding:8px;">
                    <h3 style="margin:0 0 4px 0; font-size:13px; font-weight:700;">🔔 Notificaciones</h3>
                    <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
                        ${notificacionesHTML || '<li style="font-size:11px; padding:4px; opacity:0.7;">Bandeja vacía.</li>'}
                    </ul>
                </div>

                <div style="background:#fff7f9; border:1px solid #f2d7e3; border-radius:14px; padding:8px;">
                    <h3 style="margin:0 0 4px 0; font-size:13px; font-weight:700;">🔎 Búsquedas</h3>
                    <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
                        ${busquedasHTML || '<li style="font-size:11px; padding:4px; opacity:0.7;">No hay historial.</li>'}
                    </ul>
                </div>
            </div>
        `;

        widgetPanel.innerHTML = widgetContent;
        mainPanel.style.display = 'block';

        const textWithoutData = response.replace(new RegExp(`${WIDGET_START_TAG}.*?${WIDGET_END_TAG}`, 's'), '').trim();
        return textWithoutData;

    } catch (e) {
        widgetPanel.innerHTML = '<p style="color: red; padding:10px;">[ERROR DE WIDGET: Revisa el formato de datos del bot]</p>';
        const textWithoutData = response.replace(new RegExp(`${WIDGET_START_TAG}.*?${WIDGET_END_TAG}`, 's'), '').trim();
        return textWithoutData;
    }
}


// **********************************************
// ************ ESTRUCTURA DEL HOOK ***********
// **********************************************

const extension = {
    name: "WIDGET PHANNIE", 

    onExtensionLoaded: async () => {
        extension.on('onMessageGeneration', extension.onMessageGeneration);
        
        // --- CARGA E INYECCIÓN DE TEMPLATE (ESTILO MARINARA) ---
        
        // 1. Cargar el HTML usando la función de SillyTavern
        const templateHtml = await renderExtensionTemplateAsync(extension.name, 'template');
        
        // 2. Inyectar el HTML al cuerpo (usando jQuery)
        $('body').append(templateHtml);

        // 3. Configurar el evento de clic del botón (necesita que los elementos se inyecten primero)
        const $panel = $('#phannie-widget-ui-panel');
        const $button = $('#phannie-widget-button'); 

        // Toggle el panel al hacer clic en el botón
        $button.on('click', () => {
            // Usamos toggleClass en lugar de .style.display para que el CSS maneje la animación/visibilidad
            $panel.toggleClass('phannie-open'); 
        });
    },
    
    onMessageGeneration: async (data, chat) => {
        return updateWidgetPanel(data);
    }
};

export { extension };        data.pensamientoRaro = extractValue('Pensamiento Raro');
        data.saldo = extractValue('Saldo');
        
        const transaccionesStr = extractValue('Transacciones');
        data.transacciones = transaccionesStr ? transaccionesStr.split('|').map(t => t.trim()) : [];
        
        const notificacionesStr = extractValue('Notificaciones');
        data.notificaciones = notificacionesStr ? notificacionesStr.split('|').map(n => n.trim()) : [];
        
        const busquedasStr = extractValue('Búsquedas');
        data.busquedas = busquedasStr ? busquedasStr.split('|').map(b => b.trim()) : [];

        let transaccionesHTML = data.transacciones.map(t => {
            const parts = t.split(';');
            const desc = parts[0].trim();
            const monto = parts.length > 1 ? parts[1].trim() : '';
            const isPositive = monto.includes('+');
            const icon = isPositive ? '🏧' : '☕'; 
            const color = isPositive ? '#0b8a3a' : '#444'; 

            return `
                <li style="display:flex; align-items:center; background:#fff; border:1px solid #f2d7e3; border-radius:8px; padding:4px;">
                    <span style="font-size:14px; margin-right:6px;">${icon}</span>
                    <span style="font-weight:600; font-size:12px;">${desc}</span>
                    <span style="font-weight:700; font-size:12px; color:${color}; margin-left:auto;">${monto}</span>
                </li>
            `;
        }).join('');

        let notificacionesHTML = data.notificaciones.map(n => {
             let icon = '💬'; 
             if (n.toLowerCase().includes('instagram') || n.toLowerCase().includes('twitter')) icon = '📸';
             if (n.toLowerCase().includes('recordatorio') || n.toLowerCase().includes('basura')) icon = '⚠️';
             if (n.toLowerCase().includes('facebook')) icon = '👍';

            return `<li style="font-size:12px; background:#fff; border:1px solid #f2d7e3; border-radius:8px; padding:4px;">${icon} ${n}</li>`;
        }).join('');

        let busquedasHTML = data.busquedas.map(b => {
            return `<li style="font-size:12px; background:#fff; border:1px solid #f2d7e3; border-radius:8px; padding:4px;">${b}</li>`;
        }).join('');

        const widgetContent = `
            <div style="font-family:sans-serif; font-size:12px; display:flex; flex-direction:column; gap:8px;">
                <div style="background:#fff7f9; border:1px solid #f2d7e3; border-radius:14px; padding:8px;">
                    <h3 style="margin:0 0 4px 0; font-size:13px; font-weight:700;">💭 Pensamientos</h3>
                    <p style="margin:2px 0; font-size:12px; line-height:1.3; color:#444;">"${data.pensamientoNormal || '...pensando...'}"</p>
                    <p style="margin:2px 0; font-size:12px; opacity:.8;">Raro: "${data.pensamientoRaro || '...cosas raras...'}"</p>
                </div>

                <div style="background:#fff7f9; border:1px solid #f2d7e3; border-radius:14px; padding:8px;">
                    <h3 style="margin:0 0 4px 0; font-size:13px; font-weight:700;">💳 Cartera</h3>
                    <div style="background:#ffe9f1; border:1px solid #f7c9da; border-radius:10px; padding:6px; text-align:center; margin-bottom:6px;">
                        <div style="font-size:11px; opacity:.75; font-weight:600;">Saldo</div>
                        <div style="font-size:18px; font-weight:700;">${data.saldo || '$0.00'}</div>
                    </div>
                    <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
                        ${transaccionesHTML || '<li style="font-size:11px; padding:4px; opacity:0.7;">No hay movimientos.</li>'}
                    </ul>
                </div>
                
                <div style="background:#fff7f9; border:1px solid #f2d7e3; border-radius:14px; padding:8px;">
                    <h3 style="margin:0 0 4px 0; font-size:13px; font-weight:700;">🔔 Notificaciones</h3>
                    <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
                        ${notificacionesHTML || '<li style="font-size:11px; padding:4px; opacity:0.7;">Bandeja vacía.</li>'}
                    </ul>
                </div>

                <div style="background:#fff7f9; border:1px solid #f2d7e3; border-radius:14px; padding:8px;">
                    <h3 style="margin:0 0 4px 0; font-size:13px; font-weight:700;">🔎 Búsquedas</h3>
                    <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:4px;">
                        ${busquedasHTML || '<li style="font-size:11px; padding:4px; opacity:0.7;">No hay historial.</li>'}
                    </ul>
                </div>
            </div>
        `;

        widgetPanel.innerHTML = widgetContent;
        widgetPanel.style.display = 'block';

        const textWithoutData = response.replace(new RegExp(`${WIDGET_START_TAG}.*?${WIDGET_END_TAG}`, 's'), '').trim();
        return textWithoutData;

    } catch (e) {
        widgetPanel.innerHTML = '<p style="color: red; padding:10px;">[ERROR DE WIDGET: Revisa el formato de datos del bot]</p>';
        const textWithoutData = response.replace(new RegExp(`${WIDGET_START_TAG}.*?${WIDGET_END_TAG}`, 's'), '').trim();
        return textWithoutData;
    }
}


// **********************************************
// ************ ESTRUCTURA DEL HOOK ***********
// **********************************************

const extension = {
    name: "WIDGET PHANNIE", 

    onExtensionLoaded: async () => {
        extension.on('onMessageGeneration', extension.onMessageGeneration);
        
        // --- INYECCIÓN DE UI DIRECTA AL BODY (Como las FABs del RPG Companion) ---
        
        // 1. Crear el panel (oculto inicialmente)
        const panelHtml = `
            <div id="phannie-widget-ui-panel" style="
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                width: 250px; /* Un poco más ancho para visibilidad */
                background: var(--bg3);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                padding: 10px;
                z-index: 10000; /* Alto z-index para estar sobre todo */
                display: none; 
                max-height: 80vh; 
                overflow-y: auto;
            ">
                <h2 style="font-size: 14px; margin: 0 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid var(--border-color);">
                    📱 WIDGET PHANNIE
                </h2>
                <p style="text-align:center; opacity:0.7;">Widget esperando datos...</p>
            </div>
        `;
        
        // 2. Crear el botón flotante (FAB)
        const buttonHtml = `
            <div id="phannie-widget-button" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--button-primary-bg);
                color: var(--button-primary-color);
                border-radius: 50%;
                width: 50px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                z-index: 10001; /* Más alto que el panel */
            ">
                📱
            </div>
        `;
        
        // 3. Añadir ambos elementos al cuerpo del documento (DOM)
        // Aseguramos que se inyecte directamente al final del cuerpo
        document.body.insertAdjacentHTML('beforeend', panelHtml);
        document.body.insertAdjacentHTML('beforeend', buttonHtml);

        // 4. Configurar el evento de clic del botón para TOGGLE (mostrar/ocultar) el panel
        document.getElementById('phannie-widget-button').addEventListener('click', () => {
            const panel = document.getElementById('phannie-widget-ui-panel');
            if (panel.style.display === 'none' || panel.style.display === '') {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        });
    },
    
    onMessageGeneration: async (data, chat) => {
        return updateWidgetPanel(data);
    }
};

export { extension };panel.style.display === '') {
                panel.style.display = 'block';
            } else {
                panel.style.display = 'none';
            }
        });
        // ----------------------------------------------------------------------
    },
    
    onMessageGeneration: async (data, chat) => {
        return updateWidgetPanel(data);
    }
};

export { extension };
