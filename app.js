// ==============================================================================
// ENVOLVIAFOOD | CORE APPLICATION LOGIC (app.js)
// ==============================================================================

// 1. CONFIGURACIÓN MAESTRA DE SUPABASE
const supabaseUrl = 'https://nmepokgmztzbanzzazzx.supabase.co';
const supabaseKey = 'sb_publishable_mYOTFbeLCBs4jvBQZftVEQ_QXKW_VXl';
const supabaseClient = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

if (supabaseClient) {
    console.log("✅ Conexión con Supabase establecida.");
} else {
    console.warn("⚠️ Supabase no detectado. Verifica la etiqueta <script> en tu HTML.");
}

// 2. ENRUTADOR INTELIGENTE
document.addEventListener("DOMContentLoaded", () => {
    
    // Si estamos en el Index (Login), manejamos el formulario
    if (document.getElementById('loginForm')) initLogin();

    // Renderizar menú lateral siempre que exista el contenedor
    if (document.getElementById('sidebarMenu')) renderSidebar();

    // Inicializadores de Módulos (Vaciados)
    if (document.getElementById('orders-container')) initKDS();
    if (document.getElementById('floor-plan')) initMesas();
    if (document.getElementById('delivery-container')) initDelivery();
    if (document.getElementById('costos-container')) initCostos();
    if (document.getElementById('interna-container')) initInterna();
});

// ==============================================================================
// SISTEMA DE LOGIN (NUEVO)
// ==============================================================================
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btn-login');
    const authError = document.getElementById('auth-error');

    // Por ahora, simularemos el login exitoso almacenando una sesión local.
    // Más adelante, aquí irá: supabaseClient.auth.signInWithPassword(...)
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        btnLogin.innerText = "Verificando...";
        btnLogin.disabled = true;
        authError.classList.add('hidden');

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // SIMULACIÓN DE AUTH (Acepta cualquier correo temporalmente para que puedas testear)
        setTimeout(() => {
            if (email && password) {
                // Guardamos una sesión ficticia para activar el menú
                localStorage.setItem('envolviafood_session', 'active');
                
                // Forzamos la activación de todos los módulos para el admin
                const config = { mod_interna: true, mod_costos: true, mod_delivery: true, mod_mesas: true, mod_cocina: true };
                localStorage.setItem('envolviafood_config', JSON.stringify(config));
                
                window.location.href = 'dashboard.html';
            } else {
                authError.classList.remove('hidden');
                btnLogin.innerText = "Iniciar Sesión";
                btnLogin.disabled = false;
            }
        }, 1000);
    });
}

// ==============================================================================
// RENDERIZAR MENÚ LATERAL
// ==============================================================================
function renderSidebar() {
    const configData = localStorage.getItem('envolviafood_config');
    const session = localStorage.getItem('envolviafood_session');
            
    // Protección de rutas
    if ((!configData || !session) && !window.location.pathname.includes('index.html')) {
        window.location.href = 'index.html';
        return;
    }
    if(!configData) return; 

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
// MÓDULO 1: COCINA Y KDS
// ==============================================================================
function initKDS() {
    let orders = []; // DATOS VACIADOS

    const container = document.getElementById('orders-container');

    window.markAsReady = function(id) {
        const orderIndex = orders.findIndex(o => o.id === id);
        if (orderIndex > -1) {
            orders[orderIndex].status = "ready";
            renderOrders();
        }
    };

    function renderOrders() {
        container.innerHTML = '';
        const pendingOrders = orders.filter(o => o.status === 'pending');
        
        if(pendingOrders.length === 0) {
            container.innerHTML = `<div class="flex items-center justify-center w-full h-full text-gray-500 font-bold text-xl uppercase tracking-widest"><p>No hay órdenes pendientes</p></div>`;
            return;
        }

        pendingOrders.forEach(order => {
            // (Lógica de renderizado de tarjetas mantenida para cuando ingreses datos)
        });
    }

    function updateTimers() {
        if(document.getElementById('clock')) document.getElementById('clock').innerText = new Date().toLocaleTimeString('es-ES');
    }
    setInterval(updateTimers, 1000);

    renderOrders(); updateTimers();
}

// ==============================================================================
// MÓDULO 2: PUNTO DE VENTA (MESAS Y COBROS)
// ==============================================================================
function initMesas() {
    let isEditMode = false;
    let tables = []; 
    let deliveries = []; 
    let currentOrderContext = null; 

    // Catálogo de Productos Simulado (Recetas que creaste en Inventario)
    const menuCatalog = [
        { id: 'p1', item: "Hamburguesa Clásica", price: 12.00 },
        { id: 'p2', item: "Papas Trufadas Grandes", price: 6.50 },
        { id: 'p3', item: "Pizza Margarita", price: 14.00 },
        { id: 'p4', item: "Pizza Pepperoni", price: 15.00 },
        { id: 'p5', item: "Cerveza Artesanal", price: 4.00 },
        { id: 'p6', item: "Tiramisú", price: 6.00 }
    ];

    // Referencias UI
    const tabMesas = document.getElementById('tab-mesas');
    const tabDelivery = document.getElementById('tab-delivery');
    const viewMesas = document.getElementById('view-mesas');
    const viewDelivery = document.getElementById('view-delivery');
    const headerMesas = document.getElementById('header-actions-mesas');
    const headerDelivery = document.getElementById('header-actions-delivery');
    const floorPlan = document.getElementById('floor-plan');
    const toggleEdit = document.getElementById('toggle-edit-mode');
    const btnAddTable = document.getElementById('btn-add-table');
    const labelEdit = document.getElementById('edit-mode-label');
    const deliveryList = document.getElementById('delivery-list');
    const btnAddDelivery = document.getElementById('btn-add-delivery');
    const panel = document.getElementById('order-panel');
    const btnClosePanel = document.getElementById('btn-close-panel');
    const btnOpenPayment = document.getElementById('btn-open-payment');
    
    // Referencias Añadir Producto
    const btnAddProduct = document.getElementById('btn-add-product');
    const modalAddProduct = document.getElementById('modal-add-product');
    const modalAddProductContent = document.getElementById('modal-add-product-content');
    const catalogList = document.getElementById('catalog-list');

    // -------------------------------------------------------------
    // SISTEMA DE PESTAÑAS
    // -------------------------------------------------------------
    tabMesas.addEventListener('click', () => {
        tabMesas.className = "px-4 py-2 font-bold text-sm rounded-lg bg-blue-50 text-blue-700 transition";
        tabDelivery.className = "px-4 py-2 font-bold text-sm rounded-lg text-gray-500 hover:bg-gray-100 transition";
        viewMesas.classList.remove('hidden-view');
        viewDelivery.classList.add('hidden-view');
        headerMesas.classList.remove('hidden-view');
        headerDelivery.classList.add('hidden-view');
        panel.classList.add('hidden');
    });

    tabDelivery.addEventListener('click', () => {
        tabDelivery.className = "px-4 py-2 font-bold text-sm rounded-lg bg-blue-50 text-blue-700 transition";
        tabMesas.className = "px-4 py-2 font-bold text-sm rounded-lg text-gray-500 hover:bg-gray-100 transition";
        viewDelivery.classList.remove('hidden-view');
        viewMesas.classList.add('hidden-view');
        headerDelivery.classList.remove('hidden-view');
        headerMesas.classList.add('hidden-view');
        panel.classList.add('hidden');
    });

    // -------------------------------------------------------------
    // PLANO DE MESAS
    // -------------------------------------------------------------
    function renderTables() {
        floorPlan.innerHTML = '';
        if (tables.length === 0) {
            floorPlan.innerHTML = `<div class="flex items-center justify-center w-full h-full text-gray-400 font-bold text-sm uppercase tracking-widest"><p>Activa el 'Modo Edición' y añade mesas al plano.</p></div>`;
        }

        tables.forEach(table => {
            const el = document.createElement('div');
            el.className = `restaurant-table absolute w-20 h-20 rounded-2xl border-4 flex items-center justify-center font-bold text-xl shadow-sm ${isEditMode ? 'edit-mode' : 'view-mode'} status-${table.status}`;
            el.style.left = `${table.x}px`; 
            el.style.top = `${table.y}px`;
            el.innerText = table.number;

            if (isEditMode) makeDraggable(el, table);
            else el.addEventListener('click', () => openOrderPanel(table, 'mesa'));

            floorPlan.appendChild(el);
        });
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

    // -------------------------------------------------------------
    // DELIVERY
    // -------------------------------------------------------------
    function renderDeliveries() {
        deliveryList.innerHTML = '';
        if (deliveries.length === 0) {
            deliveryList.innerHTML = `<div class="col-span-2 flex items-center justify-center w-full h-64 text-gray-400 font-bold text-sm uppercase tracking-widest"><p>No hay pedidos de delivery activos.</p></div>`;
        }

        deliveries.forEach(del => {
            const total = del.orders.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);
            const el = document.createElement('div');
            el.className = `bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-pointer hover:border-blue-500 transition`;
            el.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <span class="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">Delivery #${del.id}</span>
                        <h4 class="font-bold text-gray-900 mt-1">${del.customer}</h4>
                    </div>
                    <span class="font-black text-gray-900">$${total.toFixed(2)}</span>
                </div>
                <p class="text-xs text-gray-500 truncate">${del.address}</p>
            `;
            el.addEventListener('click', () => openOrderPanel(del, 'delivery'));
            deliveryList.appendChild(el);
        });
    }

    btnAddDelivery.addEventListener('click', () => {
        const newId = deliveries.length + 1000;
        deliveries.push({ id: newId, type: 'delivery', customer: "Cliente Express", address: "Local", status: "pending", orders: [] });
        renderDeliveries();
    });

    // -------------------------------------------------------------
    // PANEL DE LA CUENTA
    // -------------------------------------------------------------
    function openOrderPanel(data, type) {
        currentOrderContext = { data, type };
        document.getElementById('panel-type').innerText = type === 'mesa' ? 'Atención en Salón' : 'Para Llevar / Delivery';
        document.getElementById('panel-title').innerText = type === 'mesa' ? `Mesa ${data.number}` : `${data.customer}`;
        
        const content = document.getElementById('panel-content');
        const actions = document.getElementById('panel-actions');
        
        panel.classList.remove('hidden');
        actions.style.display = 'block'; // Siempre mostrar las acciones para poder añadir productos

        if (!data.orders || data.orders.length === 0) {
            content.innerHTML = `
                <div class="text-center py-12">
                    <div class="text-4xl mb-2">🍽️</div>
                    <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">La cuenta está en cero.</p>
                </div>`;
            document.getElementById('btn-open-payment').style.display = 'none'; // Ocultar cobrar si es cero
            document.getElementById('panel-total').innerText = '$0.00';
            currentOrderContext.total = 0;
        } else {
            let total = 0; 
            let html = `<ul class="space-y-3">`;
            data.orders.forEach(order => {
                const subtotal = order.qty * order.price; total += subtotal;
                html += `<li class="flex justify-between items-start bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                            <div><p class="font-bold text-gray-800 text-sm">${order.qty}x ${order.item}</p><p class="text-xs text-gray-500">$${order.price.toFixed(2)} c/u</p></div>
                            <span class="font-black text-gray-900">$${subtotal.toFixed(2)}</span>
                        </li>`;
            });
            html += `</ul>`;
            content.innerHTML = html;
            
            document.getElementById('panel-total').innerText = `$${total.toFixed(2)}`;
            document.getElementById('btn-open-payment').style.display = 'block'; // Mostrar cobrar
            currentOrderContext.total = total;
        }
    }

    btnClosePanel.addEventListener('click', () => panel.classList.add('hidden'));

    // -------------------------------------------------------------
    // LÓGICA: AÑADIR PRODUCTO A LA MESA/DELIVERY
    // -------------------------------------------------------------
    btnAddProduct.addEventListener('click', () => {
        if(!currentOrderContext) return;
        
        catalogList.innerHTML = '';
        menuCatalog.forEach(prod => {
            catalogList.innerHTML += `
                <div class="flex justify-between items-center p-3 border border-gray-200 rounded-lg hover:border-blue-500 cursor-pointer transition mb-2"
                     onclick="window.addProductToOrder('${prod.id}')">
                    <span class="font-bold text-gray-800 text-sm">${prod.item}</span>
                    <span class="font-black text-blue-600">$${prod.price.toFixed(2)}</span>
                </div>
            `;
        });

        modalAddProduct.classList.remove('hidden');
        setTimeout(() => {
            modalAddProduct.classList.remove('opacity-0');
            modalAddProductContent.classList.remove('scale-95');
        }, 10);
    });

    // Se hace global para el onclick del HTML inyectado
    window.addProductToOrder = function(prodId) {
        const prod = menuCatalog.find(p => p.id === prodId);
        if(prod && currentOrderContext) {
            
            // Si ya existe, le suma 1 a la cantidad. Si no, lo crea.
            const existing = currentOrderContext.data.orders.find(o => o.item === prod.item);
            if(existing) existing.qty += 1;
            else currentOrderContext.data.orders.push({ item: prod.item, qty: 1, price: prod.price });
            
            // Si la mesa estaba libre, ahora pasa a Ocupada
            if(currentOrderContext.type === 'mesa' && currentOrderContext.data.status === 'free') {
                currentOrderContext.data.status = 'occupied';
                renderTables();
            }

            // Actualiza la visual del panel y cierra el modal
            openOrderPanel(currentOrderContext.data, currentOrderContext.type);
            
            modalAddProduct.classList.add('opacity-0');
            modalAddProductContent.classList.add('scale-95');
            setTimeout(() => modalAddProduct.classList.add('hidden'), 300);
        }
    };

    // -------------------------------------------------------------
    // TERMINAL DE COBRO
    // -------------------------------------------------------------
    const inputReceived = document.getElementById('pay-received');
    const textChange = document.getElementById('pay-change');

    btnOpenPayment.addEventListener('click', () => {
        if (!currentOrderContext || currentOrderContext.total === 0) return;
        
        document.getElementById('pay-title').innerText = currentOrderContext.type === 'mesa' ? `Cobro Mesa ${currentOrderContext.data.number}` : `Cobro ${currentOrderContext.data.customer}`;
        document.getElementById('pay-total').innerText = `$${currentOrderContext.total.toFixed(2)}`;
        
        inputReceived.value = currentOrderContext.total.toFixed(2);
        textChange.innerText = "$0.00";

        document.getElementById('modal-payment').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('modal-payment').classList.remove('opacity-0');
            document.getElementById('modal-payment-content').classList.remove('scale-95');
        }, 10);
    });

    document.querySelectorAll('.pay-method-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.pay-method-btn').forEach(b => {
                b.classList.remove('border-green-500', 'bg-green-50', 'text-green-700');
                b.classList.add('border-gray-200', 'text-gray-500');
            });
            this.classList.remove('border-gray-200', 'text-gray-500');
            this.classList.add('border-green-500', 'bg-green-50', 'text-green-700');
            document.getElementById('cash-input-area').style.display = this.dataset.method === 'efectivo' ? 'block' : 'none';
        });
    });

    inputReceived.addEventListener('input', (e) => {
        if(!currentOrderContext) return;
        const rec = parseFloat(e.target.value) || 0;
        const change = rec - currentOrderContext.total;
        textChange.innerText = change >= 0 ? `$${change.toFixed(2)}` : "Monto insuficiente";
        textChange.className = change >= 0 ? "text-green-500 text-lg" : "text-red-500 text-sm";
    });

    document.getElementById('btn-confirm-payment').addEventListener('click', () => {
        currentOrderContext.data.orders = [];
        
        if (currentOrderContext.type === 'mesa') {
            currentOrderContext.data.status = 'free';
            renderTables();
        } else {
            deliveries = deliveries.filter(d => d.id !== currentOrderContext.data.id);
            renderDeliveries();
        }

        const modal = document.getElementById('modal-payment');
        const content = document.getElementById('modal-payment-content');
        modal.classList.add('opacity-0');
        content.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
        
        panel.classList.add('hidden');
        alert("Pago procesado con éxito. La mesa ha sido liberada.");
    });

    renderTables();
    renderDeliveries();
}

// ==============================================================================
// MÓDULO 4: INGENIERÍA DE MENÚ E INVENTARIO (costos.html)
// ==============================================================================
function initCostos() {
    let inventory = {}; // Empieza vacío
    let recipes = []; // Empieza vacío
    let currentEditingRecipe = null;
    let currentRecipeImageBase64 = null; // Guardará la imagen en memoria

    // Referencias UI
    const recipesListEl = document.getElementById('recipes-list');
    const recipePanel = document.getElementById('recipe-panel');
    const btnNewInsumo = document.getElementById('btn-new-insumo');
    const btnNewRecipe = document.getElementById('btn-new-recipe');
    const formInsumo = document.getElementById('form-insumo');
    
    // Referencias UI Receta
    const inputRecipeTitle = document.getElementById('recipe-title-input');
    const inputRecipePrice = document.getElementById('actual-price');
    const toggleMenu = document.getElementById('toggle-menu');
    const imgUpload = document.getElementById('recipe-img-upload');
    const imgPreview = document.getElementById('recipe-img-preview');
    const btnSaveRecipe = document.getElementById('btn-save-recipe');
    
    // Referencias UI Ingredientes
    const btnAddIngredient = document.getElementById('btn-add-ingredient');
    const formIngredient = document.getElementById('form-ingredient');
    const selectIngredient = document.getElementById('ingredient-select');
    const labelUnit = document.getElementById('ingredient-unit-label');

    // -------------------------------------------------------------
    // 1. GESTIÓN DEL INVENTARIO (Insumos)
    // -------------------------------------------------------------
    btnNewInsumo.addEventListener('click', () => {
        document.getElementById('modal-insumo').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('modal-insumo').classList.remove('opacity-0');
            document.getElementById('modal-insumo-content').classList.remove('scale-95');
        }, 10);
    });

    formInsumo.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = 'ing_' + Date.now();
        const name = document.getElementById('insumo-name').value;
        const unit = document.getElementById('insumo-unit').value;
        const cost = parseFloat(document.getElementById('insumo-cost').value);

        inventory[id] = { id, name, unit, costPerUnit: cost };
        
        updateKPIs();
        closeModal('modal-insumo');
        formInsumo.reset();
        alert(`Insumo "${name}" añadido al inventario con éxito.`);
    });

    // -------------------------------------------------------------
    // 2. REPOSITORIO DE IMÁGENES (FileReader local)
    // -------------------------------------------------------------
    imgUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                currentRecipeImageBase64 = event.target.result;
                imgPreview.style.backgroundImage = `url(${currentRecipeImageBase64})`;
                imgPreview.innerHTML = ''; // Quitar el ícono
            };
            reader.readAsDataURL(file);
        }
    });

    // -------------------------------------------------------------
    // 3. APERTURA Y CIERRE DEL PANEL DE RECETAS
    // -------------------------------------------------------------
    btnNewRecipe.addEventListener('click', () => {
        // Inicializar un objeto receta en blanco en memoria
        currentEditingRecipe = {
            id: 'rec_' + Date.now(),
            name: '',
            retailPrice: 0,
            isActive: true,
            image: null,
            ingredients: []
        };
        currentRecipeImageBase64 = null;
        
        // Limpiar UI del panel
        inputRecipeTitle.value = '';
        inputRecipePrice.value = '0.00';
        toggleMenu.checked = true;
        imgPreview.style.backgroundImage = 'none';
        imgPreview.innerHTML = `<svg class="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>`;
        imgUpload.value = '';

        recipePanel.classList.remove('hidden');
        window.updateRecipeMath();
        renderIngredientsList();
    });

    window.openRecipeEditor = function(recipeId) {
        currentEditingRecipe = recipes.find(r => r.id === recipeId);
        if(!currentEditingRecipe) return;

        inputRecipeTitle.value = currentEditingRecipe.name;
        inputRecipePrice.value = currentEditingRecipe.retailPrice.toFixed(2);
        toggleMenu.checked = currentEditingRecipe.isActive;
        
        // Cargar Imagen si existe
        currentRecipeImageBase64 = currentEditingRecipe.image;
        if(currentRecipeImageBase64) {
            imgPreview.style.backgroundImage = `url(${currentRecipeImageBase64})`;
            imgPreview.innerHTML = '';
        } else {
            imgPreview.style.backgroundImage = 'none';
            imgPreview.innerHTML = `<span class="text-xs text-gray-400 font-bold">SIN FOTO</span>`;
        }

        recipePanel.classList.remove('hidden');
        window.updateRecipeMath();
        renderIngredientsList();
    };

    document.getElementById('btn-close-recipe').addEventListener('click', () => {
        recipePanel.classList.add('hidden');
        currentEditingRecipe = null;
    });

    // -------------------------------------------------------------
    // 4. LÓGICA DEL ESCANDALLO (Añadir Ingredientes)
    // -------------------------------------------------------------
    btnAddIngredient.addEventListener('click', () => {
        if(Object.keys(inventory).length === 0) {
            alert("No tienes insumos en el inventario. Crea uno primero.");
            return;
        }
        
        // Llenar el selector de insumos
        selectIngredient.innerHTML = '<option value="">Selecciona...</option>';
        Object.values(inventory).forEach(inv => {
            selectIngredient.innerHTML += `<option value="${inv.id}">${inv.name} ($${inv.costPerUnit}/${inv.unit})</option>`;
        });

        // Mostrar Modal
        document.getElementById('modal-ingredient').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('modal-ingredient').classList.remove('opacity-0');
            document.getElementById('modal-ingredient-content').classList.remove('scale-95');
        }, 10);
    });

    // Cambiar la etiqueta de la unidad dinámicamente
    selectIngredient.addEventListener('change', (e) => {
        const inv = inventory[e.target.value];
        labelUnit.innerText = inv ? inv.unit : '...';
    });

    formIngredient.addEventListener('submit', (e) => {
        e.preventDefault();
        const invId = selectIngredient.value;
        const qty = parseFloat(document.getElementById('ingredient-qty').value);

        if(invId && qty > 0 && currentEditingRecipe) {
            // Revisar si ya existe el ingrediente para sumarlo, o hacer push nuevo
            const existing = currentEditingRecipe.ingredients.find(i => i.id === invId);
            if(existing) existing.qty += qty;
            else currentEditingRecipe.ingredients.push({ id: invId, qty: qty });

            renderIngredientsList();
            window.updateRecipeMath();
            closeModal('modal-ingredient');
            formIngredient.reset();
            labelUnit.innerText = '...';
        }
    });

    // -------------------------------------------------------------
    // 5. MOTOR MATEMÁTICO Y GUARDADO DE RECETA
    // -------------------------------------------------------------
    window.updateRecipeMath = function() {
        if (!currentEditingRecipe) return;
        
        // Calcular costo
        const cost = currentEditingRecipe.ingredients.reduce((total, item) => {
            const invItem = inventory[item.id];
            return !invItem ? total : total + (invItem.costPerUnit * item.qty);
        }, 0);

        const targetFcDecimal = parseFloat(document.getElementById('target-fc').value) / 100;
        let suggestedPrice = targetFcDecimal > 0 ? cost / targetFcDecimal : 0;

        document.getElementById('panel-cost').innerText = `$${cost.toFixed(2)}`;
        document.getElementById('panel-suggested-price').innerText = `$${suggestedPrice.toFixed(2)}`;
    };

    btnSaveRecipe.addEventListener('click', () => {
        if(!inputRecipeTitle.value) { alert("Ponle un nombre al plato"); return; }
        
        // Actualizar datos del objeto
        currentEditingRecipe.name = inputRecipeTitle.value;
        currentEditingRecipe.retailPrice = parseFloat(inputRecipePrice.value) || 0;
        currentEditingRecipe.isActive = toggleMenu.checked;
        currentEditingRecipe.image = currentRecipeImageBase64;

        // Guardar en el array principal (si es nuevo o actualizar si existe)
        const index = recipes.findIndex(r => r.id === currentEditingRecipe.id);
        if(index === -1) recipes.push(currentEditingRecipe);
        else recipes[index] = currentEditingRecipe;

        recipePanel.classList.add('hidden');
        renderRecipesTable();
        updateKPIs();
    });

    // -------------------------------------------------------------
    // 6. RENDERIZADO VISUAL
    // -------------------------------------------------------------
    function renderIngredientsList() {
        const listEl = document.getElementById('recipe-ingredients');
        listEl.innerHTML = '';
        
        if(currentEditingRecipe.ingredients.length === 0) {
            listEl.innerHTML = `<p class="text-xs text-gray-400 text-center italic">Escandallo vacío. Añade insumos para calcular el costo.</p>`;
            return;
        }

        currentEditingRecipe.ingredients.forEach((item, index) => {
            const invItem = inventory[item.id];
            if(!invItem) return;
            const lineCost = invItem.costPerUnit * item.qty;
            
            listEl.innerHTML += `
                <li class="flex items-center justify-between border-b border-gray-100 pb-2">
                    <div>
                        <p class="font-bold text-gray-800 text-sm">${invItem.name}</p>
                        <p class="text-xs text-gray-500">${item.qty} ${invItem.unit} a $${invItem.costPerUnit}/${invItem.unit}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-gray-900 text-sm">$${lineCost.toFixed(2)}</p>
                        <button onclick="window.removeIngredient(${index})" class="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider">Borrar</button>
                    </div>
                </li>`;
        });
    }

    window.removeIngredient = function(index) {
        currentEditingRecipe.ingredients.splice(index, 1);
        renderIngredientsList();
        window.updateRecipeMath();
    };

    function renderRecipesTable() {
        recipesListEl.innerHTML = '';
        if(recipes.length === 0) {
            recipesListEl.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-gray-400 font-bold uppercase tracking-widest text-sm">No hay recetas creadas</td></tr>`;
            return;
        }

        recipes.forEach(recipe => {
            const cost = recipe.ingredients.reduce((t, i) => t + (inventory[i.id]?.costPerUnit * i.qty || 0), 0);
            const fcPercentage = recipe.retailPrice > 0 ? (cost / recipe.retailPrice) * 100 : 0;
            
            let fcColorClass = fcPercentage > 35 ? 'text-red-600 bg-red-50' : (fcPercentage > 32 ? 'text-yellow-600 bg-yellow-50' : 'text-green-600 bg-green-50');
            const isActiveBadge = recipe.isActive ? '<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase">En Menú</span>' : '<span class="px-2 py-1 bg-gray-200 text-gray-600 rounded-full text-[10px] font-black uppercase">Oculto</span>';
            
            // Miniatura de imagen
            const imgDiv = recipe.image 
                ? `<div class="w-10 h-10 rounded-lg bg-cover bg-center shrink-0 border border-gray-200" style="background-image: url(${recipe.image})"></div>`
                : `<div class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200"><span class="text-[10px] font-bold text-gray-400">N/A</span></div>`;

            const tr = document.createElement('tr');
            tr.className = "hover:bg-gray-50 transition cursor-pointer group";
            tr.onclick = () => window.openRecipeEditor(recipe.id);
            tr.innerHTML = `
                <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                        ${imgDiv}
                        <span class="font-bold text-gray-900 group-hover:text-blue-600 transition">${recipe.name}</span>
                    </div>
                </td>
                <td class="px-4 py-3 text-right font-semibold text-gray-600">$${cost.toFixed(2)}</td>
                <td class="px-4 py-3 text-right font-black text-gray-900">$${recipe.retailPrice.toFixed(2)}</td>
                <td class="px-4 py-3 text-center"><span class="px-2 py-1 rounded font-bold text-xs ${fcColorClass}">${fcPercentage.toFixed(1)}%</span></td>
                <td class="px-4 py-3 text-center">${isActiveBadge}</td>`;
            recipesListEl.appendChild(tr);
        });
    }

    function updateKPIs() {
        document.getElementById('kpi-insumos').innerText = Object.keys(inventory).length;
        document.getElementById('kpi-recipes').innerText = recipes.length;
        
        // Calcular Food Cost promedio de todo el menú activo
        let totalCost = 0; let totalPrice = 0;
        recipes.filter(r => r.isActive).forEach(r => {
            totalCost += r.ingredients.reduce((t, i) => t + (inventory[i.id]?.costPerUnit * i.qty || 0), 0);
            totalPrice += r.retailPrice;
        });

        const fcPromedio = totalPrice > 0 ? (totalCost / totalPrice) * 100 : 0;
        document.getElementById('kpi-fc').innerText = `${fcPromedio.toFixed(1)}%`;
    }

    // Inicializar listeners fijos y renderizado base
    document.getElementById('target-fc').addEventListener('input', window.updateRecipeMath);
    renderRecipesTable();
}

// ==============================================================================
// MÓDULO 5: GESTIÓN DE RRHH Y FICHAJE (interna.html)
// ==============================================================================
function initInterna() {
    let employees = []; // Inicia vacío, como pediste

    const listEl = document.getElementById('employee-list');
    const clockDisplay = document.getElementById('clock-display');
    const clockForm = document.getElementById('clock-form');
    
    // Selectores del Modal
    const modal = document.getElementById('modal-employee');
    const modalContent = document.getElementById('modal-employee-content');
    const btnOpenModal = document.getElementById('btn-open-employee-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const formEmployee = document.getElementById('form-employee');

    const roleColors = { 'Cocina': 'bg-red-100 text-red-700', 'Salón': 'bg-blue-100 text-blue-700', 'Delivery': 'bg-yellow-100 text-yellow-700' };

    // 1. Abrir y Cerrar Modal
    if(btnOpenModal) {
        btnOpenModal.addEventListener('click', () => {
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modalContent.classList.remove('scale-95');
            }, 10);
        });
    }

    function closeModal() {
        modal.classList.add('opacity-0');
        modalContent.classList.add('scale-95');
        setTimeout(() => modal.classList.add('hidden'), 300);
        formEmployee.reset();
    }

    if(btnCloseModal) btnCloseModal.addEventListener('click', closeModal);

    // 2. Guardar Nuevo Empleado
    if(formEmployee) {
        formEmployee.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('emp-name').value;
            
            // Generar Iniciales para el Avatar
            const nameParts = name.split(' ');
            const avatar = nameParts.length > 1 
                ? (nameParts[0][0] + nameParts[1][0]).toUpperCase() 
                : nameParts[0].substring(0, 2).toUpperCase();

            const newEmployee = {
                id: 'emp_' + Date.now(),
                name: name,
                role: document.getElementById('emp-role').value,
                area: document.getElementById('emp-area').value,
                shift: document.getElementById('emp-shift').value,
                pin: document.getElementById('emp-pin').value,
                isClockedIn: false,
                avatar: avatar
            };

            employees.push(newEmployee);
            renderEmployees();
            closeModal();
        });
    }

    // 3. Renderizar Tabla de Empleados
    function renderEmployees() {
        listEl.innerHTML = '';
        let activeCount = 0;

        if(employees.length === 0) {
            listEl.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-gray-400 font-bold uppercase tracking-widest text-sm">Directorio de personal vacío</td></tr>`;
        } else {
            employees.forEach(emp => {
                if (emp.isClockedIn) activeCount++;
                const statusBadge = emp.isClockedIn ? `<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200 shadow-sm"><span class="w-2 h-2 rounded-full bg-green-500 pulse-green"></span> En Turno</span>` : `<span class="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500 border border-gray-200">Fuera de Turno</span>`;
                const actionBtn = emp.isClockedIn ? `<button onclick="window.toggleShift('${emp.id}')" class="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 px-2 py-1 rounded transition">Marcar Salida</button>` : `<button onclick="window.toggleShift('${emp.id}')" class="text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 px-2 py-1 rounded transition">Marcar Entrada</button>`;

                listEl.innerHTML += `
                    <tr class="hover:bg-gray-50 transition border-b border-gray-100">
                        <td class="px-4 py-4"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold">${emp.avatar}</div><span class="font-bold text-gray-900">${emp.name}</span></div></td>
                        <td class="px-4 py-4"><p class="text-sm font-semibold text-gray-800">${emp.role}</p><span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase mt-1 inline-block ${roleColors[emp.area] || 'bg-gray-100 text-gray-700'}">${emp.area}</span></td>
                        <td class="px-4 py-4 text-center font-medium text-gray-600 text-sm">${emp.shift}</td>
                        <td class="px-4 py-4 text-center">${statusBadge}</td>
                        <td class="px-4 py-4 text-right">${actionBtn}</td>
                    </tr>`;
            });
        }

        document.getElementById('kpi-total').innerText = employees.length;
        document.getElementById('kpi-active').innerText = activeCount;
    }

    // 4. Lógica de Fichaje Manual o por PIN
    window.toggleShift = function(id) {
        const emp = employees.find(e => e.id === id);
        if (emp) { emp.isClockedIn = !emp.isClockedIn; renderEmployees(); }
    };

    if (clockForm) {
        clockForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const pinInput = document.getElementById('clock-pin');
            const pinVal = pinInput.value;
            
            const emp = employees.find(e => e.pin === pinVal);
            if (emp) {
                emp.isClockedIn = !emp.isClockedIn;
                renderEmployees();
                pinInput.value = ''; // Limpiar el input
            } else {
                alert("PIN incorrecto o empleado no encontrado.");
            }
        });
    }

    // Reloj digital
    setInterval(() => { if (clockDisplay) clockDisplay.innerText = new Date().toLocaleTimeString('es-ES', { hour12: false }); }, 1000);

    renderEmployees();
}