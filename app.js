// ==============================================================================
// ENVOLVIAFOOD | CORE APPLICATION LOGIC (app.js)
// ==============================================================================

// 1. CONFIGURACIÓN MAESTRA DE SUPABASE
const supabaseUrl = 'https://nmepokgmztzbanzzazzx.supabase.co';
const supabaseKey = 'sb_publishable_mYOTFbeLCBs4jvBQZftVEQ_QXKW_VXl';
const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

if (supabase) {
    console.log("✅ Conexión con Supabase establecida.");
} else {
    console.warn("⚠️ Supabase no detectado. Verifica la etiqueta <script> en tu HTML.");
}

// 2. ENRUTADOR INTELIGENTE (Detecta la vista y carga solo lo necesario)
document.addEventListener("DOMContentLoaded", () => {
    
    // Renderizar menú lateral siempre que exista el contenedor
    if (document.getElementById('sidebarMenu')) renderSidebar();

    // Inicializadores de Módulos
    if (document.getElementById('orders-container')) initKDS();
    if (document.getElementById('floor-plan')) initMesas();
    if (document.getElementById('delivery-container')) initDelivery();
    if (document.getElementById('costos-container')) initCostos();
    if (document.getElementById('interna-container')) initInterna();
});


// ==============================================================================
// FUNCIONES GLOBALES Y NAVEGACIÓN
// ==============================================================================
function renderSidebar() {
    const configData = localStorage.getItem('envolviafood_config');
            
    // Protección de rutas: Si no hay configuración, forzar onboarding
    if (!configData && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
        return;
    }

    if(!configData) return; // Evita errores en el index.html

    const config = JSON.parse(configData);
    const sidebarMenu = document.getElementById('sidebarMenu');
    const activeModulesList = document.getElementById('activeModulesList'); 

    const modules = {
        mod_interna: { title: "RRHH e Interna", file: "interna.html", icon: `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>` },
        mod_costos: { title: "Inventario y Costos", file: "costos.html", icon: `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>` },
        mod_delivery: { title: "Delivery", file: "delivery.html", icon: `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>` },
        mod_mesas: { title: "Gestión de Mesas", file: "mesas.html", icon: `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>` },
        mod_cocina: { title: "Cocina (KDS)", file: "cocina.html", icon: `<svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"></path></svg>` }
    };

    const currentPath = window.location.pathname;

    for (const [key, isEnabled] of Object.entries(config)) {
        if (isEnabled && modules[key]) {
            const link = document.createElement('a');
            link.href = modules[key].file; 
            const isActive = currentPath.includes(modules[key].file);
            link.className = `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-gray-800 text-white shadow-inner' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`;
            link.innerHTML = `${modules[key].icon} ${modules[key].title}`;
            sidebarMenu.appendChild(link);

            if (activeModulesList) {
                const badge = document.createElement('span');
                badge.className = "px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full border border-green-200";
                badge.innerText = modules[key].title;
                activeModulesList.appendChild(badge);
            }
        }
    }
}


// ==============================================================================
// MÓDULO 1: COCINA Y KDS CON ASISTENTE DE VOZ
// ==============================================================================
function initKDS() {
    let orders = [
        { id: 1042, type: "Mesa 4", timestamp: Date.now() - 600000, status: "pending", items: [{ name: "Hamburguesa Clásica", qty: 1, variations: ["- Sin cebolla", "+ Extra tocino"] }, { name: "Papas Fritas Grandes", qty: 1, variations: [] }] },
        { id: 1043, type: "Delivery", timestamp: Date.now() - 120000, status: "pending", items: [{ name: "Pizza Margarita", qty: 2, variations: ["- Masa fina"] }, { name: "Refresco 1.5L", qty: 1, variations: [] }] }
    ];

    const container = document.getElementById('orders-container');

    window.markAsReady = function(id) {
        const orderIndex = orders.findIndex(o => o.id === id);
        if (orderIndex > -1) {
            orders[orderIndex].status = "ready";
            speak(`Marchando pedido de ${orders[orderIndex].type}.`);
            renderOrders();
        }
    };

    function renderOrders() {
        container.innerHTML = '';
        orders.filter(o => o.status === 'pending').forEach(order => {
            const timeClass = getTimeColorClass(order.timestamp);
            const card = document.createElement('div');
            card.className = `w-80 shrink-0 bg-gray-800 rounded-xl border-t-4 shadow-lg flex flex-col max-h-full ${timeClass.border}`;
            
            let itemsHTML = order.items.map(item => `
                <div class="mb-3 border-b border-gray-700 pb-2 last:border-0">
                    <div class="flex justify-between font-semibold text-lg"><span>${item.qty}x ${item.name}</span></div>
                    ${item.variations.length > 0 ? `<ul class="mt-1 text-sm space-y-1">${item.variations.map(v => `<li class="${v.startsWith('-') ? 'text-red-400 line-through decoration-red-400 decoration-2' : 'text-green-400 font-medium'}">${v}</li>`).join('')}</ul>` : ''}
                </div>`).join('');

            card.innerHTML = `
                <div class="p-4 bg-gray-800/50 rounded-t-xl flex justify-between items-center border-b border-gray-700">
                    <div><h2 class="text-xl font-bold">#${order.id}</h2><p class="text-sm text-gray-400">${order.type}</p></div>
                    <div class="text-right"><span class="block text-2xl font-mono font-bold ${timeClass.text} time-elapsed" data-timestamp="${order.timestamp}">00:00</span></div>
                </div>
                <div class="p-4 flex-1 overflow-y-auto">${itemsHTML}</div>
                <div class="p-4 border-t border-gray-700">
                    <button onclick="window.markAsReady(${order.id})" class="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition">Marcar Listo</button>
                </div>
            `;
            container.appendChild(card);
        });
    }

    function getTimeColorClass(timestamp) {
        const minutes = Math.floor((Date.now() - timestamp) / 60000);
        if (minutes >= 15) return { border: 'border-red-500', text: 'text-red-500' };
        if (minutes >= 10) return { border: 'border-yellow-500', text: 'text-yellow-500' };
        return { border: 'border-green-500', text: 'text-green-500' };
    }

    function updateTimers() {
        if(document.getElementById('clock')) document.getElementById('clock').innerText = new Date().toLocaleTimeString('es-ES');
        document.querySelectorAll('.time-elapsed').forEach(el => {
            const diff = Date.now() - parseInt(el.getAttribute('data-timestamp'));
            el.innerText = `${Math.floor(diff / 60000).toString().padStart(2, '0')}:${Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')}`;
        });
    }
    setInterval(updateTimers, 1000);

    // -- ASISTENTE DE VOZ (Oído Chef) --
    const btnMic = document.getElementById('btn-mic');
    const voiceStatus = document.getElementById('voice-status');
    let recognition;
    let isListeningIntentionally = false; 

    function speak(text) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; utterance.rate = 1.1;
        synth.speak(utterance);
    }

    function findOrderFromCommand(command) {
        const mesaMatch = command.match(/mesa\s*(\d+)/);
        if (mesaMatch) return orders.find(o => o.type.toLowerCase().includes(`mesa ${mesaMatch[1]}`) && o.status === 'pending');
        const idMatch = command.match(/\d+/);
        if (idMatch) return orders.find(o => o.id === parseInt(idMatch[0]) && o.status === 'pending');
        return null;
    }

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true; recognition.lang = 'es-ES'; recognition.interimResults = false;

        recognition.onstart = () => {
            btnMic.classList.add('bg-red-600', 'listening-pulse'); btnMic.classList.remove('bg-gray-800');
            voiceStatus.innerText = "Escuchando (Di 'Chef' para comandos)...";
        };

        recognition.onresult = (event) => {
            const command = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            if (command.includes('chef')) {
                if (command.includes('lista') || command.includes('listo') || command.includes('marca')) {
                    const targetOrder = findOrderFromCommand(command);
                    if (targetOrder) window.markAsReady(targetOrder.id);
                    else speak("No encontré ese pedido, chef.");
                } 
                else if (command.includes('lee') || command.includes('leer')) {
                    const targetOrder = findOrderFromCommand(command);
                    if (targetOrder) {
                        let txt = `${targetOrder.type}. `;
                        targetOrder.items.forEach(i => { txt += `${i.qty} ${i.name}. `; if (i.variations.length > 0) txt += `Atención: ${i.variations.join(', ')}. `; });
                        speak(txt);
                    } else speak("No encontré ese pedido para leer, chef.");
                }
            }
        };

        recognition.onerror = (e) => console.error("Error de voz:", e.error);
        recognition.onend = () => {
            if (isListeningIntentionally) { try { recognition.start(); } catch (err) { } } 
            else { btnMic.classList.remove('bg-red-600', 'listening-pulse'); btnMic.classList.add('bg-gray-800'); voiceStatus.innerText = "Asistente inactivo"; }
        };
    }

    if(btnMic) {
        btnMic.addEventListener('click', () => {
            if (isListeningIntentionally) {
                isListeningIntentionally = false; if(recognition) recognition.stop(); speak("Asistente desactivado.");
            } else {
                isListeningIntentionally = true; if(recognition) recognition.start(); speak("Oído, chef.");
            }
        });
    }

    renderOrders(); updateTimers();
}


// ==============================================================================
// MÓDULO 2: CONTROL DE MESAS INTERACTIVO (Drag & Drop)
// ==============================================================================
function initMesas() {
    let isEditMode = false;
    let tables = [
        { id: 1, number: "1", x: 50, y: 50, status: "free", orders: [] },
        { id: 2, number: "2", x: 200, y: 50, status: "occupied", orders: [{ item: "Pizza Pepperoni", qty: 1, price: 12.50 }, { item: "Cerveza Artesanal", qty: 2, price: 4.00 }] },
        { id: 3, number: "3", x: 50, y: 180, status: "waiting", orders: [{ item: "Pasta Carbonara", qty: 2, price: 14.00 }, { item: "Tiramisú", qty: 1, price: 6.00 }] },
        { id: 4, number: "VIP", x: 250, y: 220, status: "free", orders: [] }
    ];

    const floorPlan = document.getElementById('floor-plan');
    const toggleEdit = document.getElementById('toggle-edit-mode');
    const btnAddTable = document.getElementById('btn-add-table');
    const labelEdit = document.getElementById('edit-mode-label');
    const panel = document.getElementById('table-panel');

    const statusMap = {
        'free': { text: 'Disponible', colorClass: 'text-green-600', bgClass: 'bg-green-100' },
        'occupied': { text: 'Comiendo', colorClass: 'text-red-600', bgClass: 'bg-red-100' },
        'waiting': { text: 'Esperando Comida', colorClass: 'text-yellow-600', bgClass: 'bg-yellow-100' }
    };

    function renderTables() {
        floorPlan.innerHTML = '';
        let freeCount = 0; let occCount = 0;

        tables.forEach(table => {
            if (table.status === 'free') freeCount++; else occCount++;

            const el = document.createElement('div');
            el.className = `restaurant-table absolute w-20 h-20 rounded-2xl border-4 flex items-center justify-center font-bold text-xl shadow-sm ${isEditMode ? 'edit-mode' : 'view-mode'} status-${table.status}`;
            el.style.left = `${table.x}px`; el.style.top = `${table.y}px`;
            el.innerText = table.number;

            if (isEditMode) makeDraggable(el, table);
            else el.addEventListener('click', () => openTableDetails(table));

            floorPlan.appendChild(el);
        });

        document.getElementById('count-free').innerText = freeCount;
        document.getElementById('count-occupied').innerText = occCount;
    }

    function makeDraggable(element, tableData) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = (e) => {
            e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; tableData.x = parseInt(element.style.left); tableData.y = parseInt(element.style.top); };
            document.onmousemove = (e) => {
                e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px"; element.style.left = (element.offsetLeft - pos1) + "px";
            };
        };
    }

    function openTableDetails(table) {
        document.getElementById('panel-title').innerText = `Mesa ${table.number}`;
        const content = document.getElementById('panel-content');
        const actions = document.getElementById('panel-actions');
        
        panel.classList.remove('hidden');

        let html = `<div class="mb-6 flex items-center gap-2"><span class="px-3 py-1 text-xs font-bold rounded-full ${statusMap[table.status].bgClass} ${statusMap[table.status].colorClass} uppercase tracking-wider">${statusMap[table.status].text}</span></div>`;

        if (table.orders.length === 0) {
            html += `<div class="text-center py-8 text-gray-400"><p>La mesa está vacía.</p></div>`;
            actions.style.display = 'block'; document.getElementById('btn-pay').style.display = 'none';
        } else {
            let total = 0; html += `<ul class="space-y-4 mb-6">`;
            table.orders.forEach(order => {
                const subtotal = order.qty * order.price; total += subtotal;
                html += `<li class="flex justify-between items-start border-b border-gray-100 pb-2"><div><p class="font-bold text-gray-800">${order.qty}x ${order.item}</p><p class="text-xs text-gray-500">$${order.price.toFixed(2)} c/u</p></div><span class="font-semibold text-gray-900">$${subtotal.toFixed(2)}</span></li>`;
            });
            html += `</ul><div class="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center mt-auto"><span class="text-sm font-bold text-gray-500 uppercase">Total a pagar</span><span class="text-2xl font-black text-blue-600">$${total.toFixed(2)}</span></div>`;
            actions.style.display = 'block'; document.getElementById('btn-pay').style.display = 'flex';
        }
        content.innerHTML = html;
    }

    toggleEdit.addEventListener('change', (e) => {
        isEditMode = e.target.checked;
        labelEdit.innerText = isEditMode ? 'Modo Edición' : 'Modo Visualización';
        labelEdit.className = isEditMode ? 'mr-3 text-sm font-bold text-purple-600' : 'mr-3 text-sm font-semibold text-gray-700';
        btnAddTable.style.display = isEditMode ? 'flex' : 'none';
        if (isEditMode) panel.classList.add('hidden');
        renderTables();
    });

    btnAddTable.addEventListener('click', () => {
        const newId = tables.length + 1;
        tables.push({ id: newId, number: newId.toString(), x: 100, y: 100, status: "free", orders: [] });
        renderTables();
    });

    document.getElementById('btn-close-panel').addEventListener('click', () => panel.classList.add('hidden'));

    renderTables();
}


// ==============================================================================
// MÓDULO 3: GESTIÓN LOGÍSTICA DE DELIVERY
// ==============================================================================
function initDelivery() {
    let zones = [
        { id: 'z1', name: 'Chacao / Altamira', distance: '0 - 3 km', fee: 2.50 },
        { id: 'z2', name: 'Las Mercedes / Baruta', distance: '3 - 6 km', fee: 4.00 },
        { id: 'z3', name: 'Centro / Libertador', distance: '5 - 8 km', fee: 5.00 },
        { id: 'z4', name: 'El Hatillo', distance: '8 - 12 km', fee: 7.00 }
    ];

    let deliveryOrders = [
        { id: 1045, customer: "Carlos Martínez", phone: "0414-1234567", address: "Av. Fco de Miranda, Torre Europa", zoneId: "z1", subtotal: 24.00, status: "ready" },
        { id: 1046, customer: "Ana Gómez", phone: "0424-9876543", address: "Calle París con Monterrey", zoneId: "z2", subtotal: 35.50, status: "pending" },
        { id: 1047, customer: "Luis Pérez", phone: "0412-5554433", address: "Av. Urdaneta, Esq de Ánimas", zoneId: "z3", subtotal: 18.00, status: "en_route" }
    ];

    const zonesListEl = document.getElementById('zones-list');
    const ordersListEl = document.getElementById('delivery-orders-list');

    const statusConfig = {
        'pending': { text: 'En Cocina', class: 'bg-yellow-100 text-yellow-700' },
        'ready': { text: 'Listo para Despacho', class: 'bg-green-100 text-green-700' },
        'en_route': { text: 'En Ruta', class: 'bg-blue-100 text-blue-700' }
    };

    function renderZones() {
        zonesListEl.innerHTML = '';
        zones.forEach(zone => {
            zonesListEl.innerHTML += `
                <li class="flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition">
                    <div><p class="font-bold text-gray-800 text-sm">${zone.name}</p><p class="text-xs text-gray-500">${zone.distance}</p></div>
                    <div class="flex items-center gap-3"><span class="font-black text-gray-900">$${zone.fee.toFixed(2)}</span></div>
                </li>`;
        });
    }

    function renderOrders() {
        ordersListEl.innerHTML = '';
        deliveryOrders.forEach(order => {
            const zone = zones.find(z => z.id === order.zoneId);
            const deliveryFee = zone ? zone.fee : 0;
            const total = order.subtotal + deliveryFee;

            let zoneOptions = zones.map(z => `<option value="${z.id}" ${z.id === order.zoneId ? 'selected' : ''}>${z.name} (+$${z.fee})</option>`).join('');

            ordersListEl.innerHTML += `
                <tr class="hover:bg-gray-50 transition group">
                    <td class="px-6 py-4"><p class="font-bold text-gray-900">#${order.id}</p><p class="text-xs font-semibold text-gray-700 mt-1">${order.customer}</p><p class="text-xs text-gray-500">${order.phone}</p></td>
                    <td class="px-6 py-4 max-w-xs">
                        <p class="text-sm text-gray-800 truncate" title="${order.address}">${order.address}</p>
                        <select onchange="window.updateOrderZone(${order.id}, this.value)" class="mt-2 text-xs border border-gray-300 rounded px-2 py-1 bg-white text-gray-600 outline-none w-full"><option value="">Seleccionar área...</option>${zoneOptions}</select>
                    </td>
                    <td class="px-6 py-4"><p class="text-xs text-gray-500">Comida: $${order.subtotal.toFixed(2)}</p><p class="text-xs text-gray-500 border-b border-gray-200 pb-1 mb-1">Envío: $${deliveryFee.toFixed(2)}</p><p class="font-bold text-gray-900">Total: $${total.toFixed(2)}</p></td>
                    <td class="px-6 py-4 text-center"><span class="px-3 py-1 rounded-full text-xs font-bold ${statusConfig[order.status].class}">${statusConfig[order.status].text}</span></td>
                    <td class="px-6 py-4 text-right">
                        ${order.status === 'ready' ? `<button onclick="window.dispatchOrder(${order.id})" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-bold transition">Despachar</button>` : `<span class="text-gray-400 font-medium text-xs">Sin acción</span>`}
                    </td>
                </tr>`;
        });
    }

    // Funciones expuestas globalmente para onclick en HTML inyectado
    window.updateOrderZone = function(orderId, newZoneId) {
        const order = deliveryOrders.find(o => o.id === orderId);
        if (order) { order.zoneId = newZoneId; renderOrders(); }
    };

    window.dispatchOrder = function(orderId) {
        const order = deliveryOrders.find(o => o.id === orderId);
        if (order) { order.status = 'en_route'; renderOrders(); }
    };

    renderZones(); renderOrders();
}


// ==============================================================================
// MÓDULO 4: INGENIERÍA DE MENÚ (Costos)
// ==============================================================================
function initCostos() {
    const inventory = {
        'ing_01': { name: 'Carne de Res Molida', unit: 'kg', costPerUnit: 8.50 },
        'ing_02': { name: 'Pan de Hamburguesa', unit: 'und', costPerUnit: 0.45 },
        'ing_03': { name: 'Queso Cheddar', unit: 'kg', costPerUnit: 12.00 },
        'ing_04': { name: 'Salsa Especial', unit: 'L', costPerUnit: 5.00 },
        'ing_05': { name: 'Papas Fritas Congeladas', unit: 'kg', costPerUnit: 3.20 },
        'ing_06': { name: 'Harina de Trigo', unit: 'kg', costPerUnit: 1.20 },
        'ing_07': { name: 'Queso Mozzarella', unit: 'kg', costPerUnit: 9.00 }
    };

    let recipes = [
        { id: 'rec_01', name: 'Hamburguesa Clásica', retailPrice: 12.00, isActive: true, ingredients: [ { id: 'ing_01', qty: 0.200 }, { id: 'ing_02', qty: 1 }, { id: 'ing_03', qty: 0.040 }, { id: 'ing_04', qty: 0.030 } ] },
        { id: 'rec_02', name: 'Papas Trufadas Grandes', retailPrice: 6.50, isActive: true, ingredients: [ { id: 'ing_05', qty: 0.350 } ] },
        { id: 'rec_03', name: 'Pizza Margarita', retailPrice: 14.00, isActive: false, ingredients: [ { id: 'ing_06', qty: 0.250 }, { id: 'ing_07', qty: 0.150 } ] }
    ];

    const recipesListEl = document.getElementById('recipes-list');
    const recipePanel = document.getElementById('recipe-panel');
    let currentEditingRecipe = null;

    function calculateRecipeCost(recipeIngredients) {
        return recipeIngredients.reduce((total, item) => {
            const inventoryItem = inventory[item.id];
            return !inventoryItem ? total : total + (inventoryItem.costPerUnit * item.qty);
        }, 0);
    }

    function renderRecipesTable() {
        recipesListEl.innerHTML = '';
        recipes.forEach(recipe => {
            const cost = calculateRecipeCost(recipe.ingredients);
            const fcPercentage = recipe.retailPrice > 0 ? (cost / recipe.retailPrice) * 100 : 0;
            
            let fcColorClass = fcPercentage > 35 ? 'text-red-600 bg-red-50' : (fcPercentage > 32 ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50');
            const isActiveBadge = recipe.isActive ? '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">En Menú</span>' : '<span class="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-[10px] font-black uppercase">Oculto</span>';

            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50 transition cursor-pointer group";
            tr.onclick = () => window.openRecipeEditor(recipe);
            tr.innerHTML = `<td class="px-4 py-3 font-bold text-gray-900 group-hover:text-blue-600 transition">${recipe.name}</td><td class="px-4 py-3 text-right font-semibold text-gray-600">$${cost.toFixed(2)}</td><td class="px-4 py-3 text-right font-black text-gray-900">$${recipe.retailPrice.toFixed(2)}</td><td class="px-4 py-3 text-center"><span class="px-2 py-1 rounded font-bold text-xs ${fcColorClass}">${fcPercentage.toFixed(1)}%</span></td><td class="px-4 py-3 text-center">${isActiveBadge}</td>`;
            recipesListEl.appendChild(tr);
        });
    }

    window.openRecipeEditor = function(recipe) {
        currentEditingRecipe = recipe;
        document.getElementById('recipe-title').innerText = recipe.name;
        document.getElementById('toggle-menu').checked = recipe.isActive;
        document.getElementById('actual-price').value = recipe.retailPrice.toFixed(2);
        recipePanel.classList.remove('hidden');
        window.updateRecipeMath();
        renderIngredientsList(recipe.ingredients);
    };

    window.updateRecipeMath = function() {
        if (!currentEditingRecipe) return;
        const cost = calculateRecipeCost(currentEditingRecipe.ingredients);
        const targetFcDecimal = parseFloat(document.getElementById('target-fc').value) / 100;
        let suggestedPrice = targetFcDecimal > 0 ? cost / targetFcDecimal : 0;

        document.getElementById('panel-cost').innerText = `$${cost.toFixed(2)}`;
        document.getElementById('panel-suggested-price').innerText = `$${suggestedPrice.toFixed(2)}`;
    };

    function renderIngredientsList(ingredients) {
        const listEl = document.getElementById('recipe-ingredients');
        listEl.innerHTML = '';
        ingredients.forEach(item => {
            const invItem = inventory[item.id];
            const lineCost = invItem.costPerUnit * item.qty;
            listEl.innerHTML += `<li class="flex items-center justify-between border-b border-gray-100 pb-2"><div><p class="font-bold text-gray-800 text-sm">${invItem.name}</p><p class="text-xs text-gray-500">${item.qty} ${invItem.unit} a $${invItem.costPerUnit}/${invItem.unit}</p></div><div class="text-right"><p class="font-bold text-gray-900 text-sm">$${lineCost.toFixed(2)}</p></div></li>`;
        });
    }

    document.getElementById('btn-close-recipe').addEventListener('click', () => { recipePanel.classList.add('hidden'); currentEditingRecipe = null; });
    document.getElementById('target-fc').addEventListener('input', window.updateRecipeMath);

    renderRecipesTable();
}


// ==============================================================================
// MÓDULO 5: RRHH Y FICHAJE (interna.html)
// ==============================================================================
function initInterna() {
    let employees = [
        { id: 'emp_01', name: 'Carlos Mendoza', role: 'Chef Ejecutivo', area: 'Cocina', shift: '08:00 - 16:00', isClockedIn: true, avatar: 'CM' },
        { id: 'emp_02', name: 'Lucía Vargas', role: 'Mesonera Principal', area: 'Salón', shift: '12:00 - 20:00', isClockedIn: true, avatar: 'LV' },
        { id: 'emp_03', name: 'Pedro Salazar', role: 'Ayudante de Cocina', area: 'Cocina', shift: '16:00 - 00:00', isClockedIn: false, avatar: 'PS' },
        { id: 'emp_04', name: 'Miguel Rojas', role: 'Repartidor', area: 'Delivery', shift: '18:00 - 23:00', isClockedIn: false, avatar: 'MR' }
    ];

    const listEl = document.getElementById('employee-list');
    const clockDisplay = document.getElementById('clock-display');
    
    const roleColors = { 'Cocina': 'bg-red-100 text-red-700', 'Salón': 'bg-blue-100 text-blue-700', 'Delivery': 'bg-yellow-100 text-yellow-700' };

    function renderEmployees() {
        listEl.innerHTML = '';
        let activeCount = 0;

        employees.forEach(emp => {
            if (emp.isClockedIn) activeCount++;
            const statusBadge = emp.isClockedIn ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm"><span class="w-2 h-2 rounded-full bg-green-500 pulse-green"></span> En Turno</span>` : `<span class="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">Fuera de Turno</span>`;
            const actionBtn = emp.isClockedIn ? `<button onclick="window.toggleShift('${emp.id}')" class="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded transition">Marcar Salida</button>` : `<button onclick="window.toggleShift('${emp.id}')" class="text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 px-2 py-1 rounded transition">Marcar Entrada</button>`;

            listEl.innerHTML += `
                <tr class="hover:bg-gray-50 transition">
                    <td class="px-4 py-4"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold">${emp.avatar}</div><span class="font-bold text-gray-900">${emp.name}</span></div></td>
                    <td class="px-4 py-4"><p class="text-sm font-semibold text-gray-800">${emp.role}</p><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 inline-block ${roleColors[emp.area]}">${emp.area}</span></td>
                    <td class="px-4 py-4 text-center font-medium text-gray-600 text-sm">${emp.shift}</td>
                    <td class="px-4 py-4 text-center">${statusBadge}</td>
                    <td class="px-4 py-4 text-right">${actionBtn}</td>
                </tr>`;
        });

        document.getElementById('kpi-total').innerText = employees.length;
        document.getElementById('kpi-active').innerText = activeCount;
    }

    window.toggleShift = function(id) {
        const emp = employees.find(e => e.id === id);
        if (emp) { emp.isClockedIn = !emp.isClockedIn; renderEmployees(); }
    };

    setInterval(() => { if (clockDisplay) clockDisplay.innerText = new Date().toLocaleTimeString('es-ES', { hour12: false }); }, 1000);

    renderEmployees();
}