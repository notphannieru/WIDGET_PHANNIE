// index.js - WIDGET PHANNIE (Botón Flotante)

// **********************************************
// ********* LÓGICA DE PROCESAMIENTO **********
// **********************************************

function updateWidgetPanel(response) {
    const WIDGET_START_TAG = '<WIDGET_DATA>';
    const WIDGET_END_TAG = '</WIDGET_DATA>';
    const panelId = 'phannie-widget-ui-panel'; 

    let widgetPanel = document.getElementById(panelId);
    let widgetButton = document.getElementById('phannie-widget-button');

    if (!widgetPanel || !widgetButton) {
        return response; // No hay panel/botón, devolvemos el texto original
    }
    
    // Si el mensaje no contiene el bloque de datos, reiniciamos el panel.
    if (!response.includes(WIDGET_START_TAG)) {
        widgetPanel.innerHTML = '<p style="text-align:center; padding:10px; font-style: italic; opacity:0.8;">Esperando la primera respuesta de la IA...</p>';
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

        // --- Generación de HTML (Tu Diseño) ---
        // El código de generación de HTML permanece igual para actualizar el contenido del panel
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

        // 2. Actualizar el contenido del panel y mostrarlo
        widgetPanel.innerHTML = widgetContent;
        widgetPanel.style.display = 'block'; // Aseguramos que esté visible

        // 3. Devolver el mensaje del bot *sin* el bloque de datos
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
        // Enganche para el procesamiento de mensajes
        extension.on('onMessageGeneration', extension.onMessageGeneration);
        
        // --- CÓDIGO CLAVE PARA EL BOTÓN Y PANEL FLOTANTE (Enganche directo al DOM) ---
        
        // 1. Crear el panel (oculto inicialmente)
        const panelHtml = `
            <div id="phannie-widget-ui-panel" style="
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                width: 200px;
                background: var(--bg3);
                border: 1px solid var(--border-color);
                border-radius: 16px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                padding: 10px;
                z-index: 1000;
                display: none; /* Inicialmente oculto */
                max-height: 80vh; 
                overflow-y: auto;
            ">
                <h2 style="font-size: 14px; margin: 0 0 10px 0; padding-bottom: 5px; border-bottom: 1px solid var(--border-color);">
                    📱 WIDGET PHANNIE
                </h2>
                <p style="text-align:center; opacity:0.7;">Widget esperando datos...</p>
            </div>
        `;
        
        // 2. Crear el botón flotante
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
                z-index: 1001;
            ">
                📱
            </div>
        `;
        
        // 3. Añadir ambos elementos al cuerpo del documento (DOM)
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
        // ----------------------------------------------------------------------
    },
    
    onMessageGeneration: async (data, chat) => {
        return updateWidgetPanel(data);
    }
};

export { extension };
