        class CurrencyConverter {
            constructor(exchangeRates = {}) {
                this.exchangeRates = exchangeRates;
            }

            async fetchExchangeRates(baseCurrency = 'MXN') {
                try {
                    const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const data = await response.json();
                    this.exchangeRates = data.rates;
                    return this.exchangeRates;
                } catch (error) {
                    console.error('Error fetching exchange rates:', error);
                    return null;
                }
            }

            convert(amount, fromCurrency, toCurrency) {
                if (!this.exchangeRates || !this.exchangeRates[fromCurrency] || !this.exchangeRates[toCurrency]) {
                    console.warn('Exchange rates not loaded or invalid currencies.');
                    return null;
                }

                const baseAmountUSD = amount / this.exchangeRates[fromCurrency];
                return baseAmountUSD * this.exchangeRates[toCurrency];
            }
        }

        class BookingCalculator {
            constructor(basePriceUSD = 60) { // Base price in USD
                this.basePriceUSD = basePriceUSD;
                this.additionalServiceRatesUSD = {
                    wifi: 1,
                    bebidas: 1.5,
                    asistente: 2.5,
                };
                this.ivaRate = 0.16; // Mexico IVA rate
                this.currencyConverter = new CurrencyConverter();
                this.currentCurrency = 'USD'; // Default currency
                this.exchangeRateUSDToMXN = null;

                this.elements = {
                    duracionSelect: document.getElementById('duracion'),
                    wifiCheckbox: document.getElementById('wifi'),
                    bebidasCheckbox: document.getElementById('bebidas'),
                    asistenteCheckbox: document.getElementById('asistente'),
                    additionalServicesSpan: document.querySelectorAll('.flex.justify-between')[1].querySelector('span:last-child'),
                    ivaSpan: document.querySelectorAll('.flex.justify-between')[2].querySelector('span:last-child'),
                    totalSpan: document.querySelector('.flex.justify-between.font-semibold.text-lg').querySelector('span:last-child'),
                    currencySelector: document.getElementById('currency-selector'), // Optional currency selector
                };

                this.initializeEventListeners();
                this.loadInitialData();
            }

            async loadInitialData() {
                await this.currencyConverter.fetchExchangeRates('USD');
                this.exchangeRateUSDToMXN = this.currencyConverter.exchangeRates['MXN'];
                this.updateTotal();
            }

            initializeEventListeners() {
                if (this.elements.duracionSelect) {
                    this.elements.duracionSelect.addEventListener('change', this.updateBasePrice.bind(this));
                }
                if (this.elements.wifiCheckbox) {
                    this.elements.wifiCheckbox.addEventListener('change', this.updateTotal.bind(this));
                }
                if (this.elements.bebidasCheckbox) {
                    this.elements.bebidasCheckbox.addEventListener('change', this.updateTotal.bind(this));
                }
                if (this.elements.asistenteCheckbox) {
                    this.elements.asistenteCheckbox.addEventListener('change', this.updateTotal.bind(this));
                }
                if (this.elements.currencySelector) {
                    this.elements.currencySelector.addEventListener('change', this.changeCurrency.bind(this));
                }
            }

            updateBasePrice() {
                if (!this.elements.duracionSelect) return;
                const days = parseInt(this.elements.duracionSelect.value) / 24;
                const basePriceUSD = this.basePriceUSD * days;
                const basePriceElement = document.querySelectorAll('.flex.justify-between')[0].querySelector('span:last-child');
                const currencySymbol = this.currentCurrency === 'USD' ? '$' : 'MXN$';
                const formattedPrice = this.formatCurrency(basePriceUSD, this.currentCurrency);
                document.querySelectorAll('.flex.justify-between')[0].querySelector('span:first-child').textContent = `Tarifa base (${days} día${days > 1 ? 's' : ''})`;
                document.querySelectorAll('.flex.justify-between')[0].querySelector('span:last-child').textContent = `${currencySymbol}${formattedPrice}`;
                this.updateTotal();
            }

            calculateAdditionalServicesUSD() {
                let additionalServicesUSD = 0;
                if (this.elements.wifiCheckbox?.checked) additionalServicesUSD += this.additionalServiceRatesUSD.wifi;
                if (this.elements.bebidasCheckbox?.checked) additionalServicesUSD += this.additionalServiceRatesUSD.bebidas;
                if (this.elements.asistenteCheckbox?.checked) additionalServicesUSD += this.additionalServiceRatesUSD.asistente;
                return additionalServicesUSD;
            }

            calculateSubtotalUSD() {
                const days = parseInt(this.elements.duracionSelect?.value || 24) / 24;
                const basePriceUSD = this.basePriceUSD * days;
                const additionalServicesUSD = this.calculateAdditionalServicesUSD();
                return basePriceUSD + additionalServicesUSD;
            }

            calculateTotalUSD() {
                const subtotalUSD = this.calculateSubtotalUSD();
                const ivaUSD = subtotalUSD * this.ivaRate;
                return subtotalUSD + ivaUSD;
            }

            updateTotal() {
                const additionalServicesUSD = this.calculateAdditionalServicesUSD();
                const subtotalUSD = this.calculateSubtotalUSD();
                const ivaUSD = subtotalUSD * this.ivaRate;
                const totalUSD = this.calculateTotalUSD();

                const currencySymbol = this.currentCurrency === 'USD' ? '$' : 'MXN$';

                this.elements.additionalServicesSpan.textContent = `${currencySymbol}${this.formatCurrency(additionalServicesUSD, this.currentCurrency)}`;
                this.elements.ivaSpan.textContent = `${currencySymbol}${this.formatCurrency(ivaUSD, this.currentCurrency)}`;
                this.elements.totalSpan.textContent = `${currencySymbol}${this.formatCurrency(totalUSD, this.currentCurrency)}`;
            }

            async changeCurrency() {
                if (!this.elements.currencySelector) return;
                this.currentCurrency = this.elements.currencySelector.value;
                await this.loadInitialData(); // Reload rates if currency changes significantly later
                this.updateBasePrice();
                this.updateTotal();
            }

            formatCurrency(amount, currency) {
                if (currency === 'MXN' && this.exchangeRateUSDToMXN) {
                    return (amount * this.exchangeRateUSDToMXN).toFixed(0);
                }
                return amount.toFixed(0); // Default to USD
            }
        }

        document.addEventListener('DOMContentLoaded', function () {
            // Custom cursor (remains the same)
            const cursor = document.createElement('div');
            const cursorDot = document.createElement('div');
            cursor.classList.add('custom-cursor');
            cursorDot.classList.add('cursor-dot');
            document.body.appendChild(cursor);
            document.body.appendChild(cursorDot);

            let cursorX = 0;
            let cursorY = 0;
            let dotX = 0;
            let dotY = 0;

            document.addEventListener('mousemove', (e) => {
                cursorX = e.clientX;
                cursorY = e.clientY;

                cursor.style.left = cursorX + 'px';
                cursor.style.top = cursorY + 'px';
            });

            function animate() {
                let distX = cursorX - dotX;
                let distY = cursorY - dotY;

                dotX += distX * 0.1;
                dotY += distY * 0.1;

                cursorDot.style.left = dotX + 'px';
                cursorDot.style.top = dotY + 'px';

                requestAnimationFrame(animate);
            }

            animate();

            document.addEventListener('mousedown', () => cursor.classList.add('active'));
            document.addEventListener('mouseup', () => cursor.classList.remove('active'));

            // Mobile menu toggle (remains the same)
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            mobileMenuButton.addEventListener('click', function () {
                mobileMenu.classList.toggle('hidden');
                const icon = mobileMenuButton.querySelector('i');
                if (mobileMenu.classList.contains('hidden')) {
                    icon.classList.remove('ri-close-line');
                    icon.classList.add('ri-menu-line');
                } else {
                    icon.classList.remove('ri-menu-line');
                    icon.classList.add('ri-close-line');
                }
            });

            // Tab functionality (remains the same)
            const tabButtons = document.querySelectorAll('.tab-button');
            tabButtons.forEach(button => {
                button.addEventListener('click', function () {
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                    this.classList.add('active');
                    const tabId = this.getAttribute('data-tab');
                    document.getElementById(`${tabId}-content`).classList.add('active');
                });
            });

            // Initialize Booking Calculator
            new BookingCalculator();

            // Payment modal (remains the same)
            const continuarPagoBtn = document.getElementById('continuar-pago');
            const modalPago = document.getElementById('modal-pago');
            const cerrarModalBtn = document.getElementById('cerrar-modal');
            const cancelarPagoBtn = document.getElementById('cancelar-pago');
            const confirmarPagoBtn = document.getElementById('confirmar-pago');
            const modalConfirmacion = document.getElementById('modal-confirmacion');
            const cerrarConfirmacionBtn = document.getElementById('cerrar-confirmacion');

            continuarPagoBtn.addEventListener('click', function () {
                modalPago.classList.remove('hidden');
            });

            cerrarModalBtn.addEventListener('click', function () {
                modalPago.classList.add('hidden');
            });

            cancelarPagoBtn.addEventListener('click', function () {
                modalPago.classList.add('hidden');
            });

            confirmarPagoBtn.addEventListener('click', function () {
                modalPago.classList.add('hidden');
                modalConfirmacion.classList.remove('hidden');
            });

            cerrarConfirmacionBtn.addEventListener('click', function () {
                modalConfirmacion.classList.add('hidden');
                window.location.href = 'index.html';
            });

            // Payment method selection (remains the same)
            const paymentOptions = document.querySelectorAll('.payment-option');
            const paymentForms = document.querySelectorAll('.payment-form');

            paymentOptions.forEach(option => {
                option.addEventListener('click', function () {
                    paymentOptions.forEach(opt => opt.classList.remove('selected'));
                    this.classList.add('selected');
                    paymentForms.forEach(form => form.classList.add('hidden'));
                    const paymentMethod = this.getAttribute('data-payment');
                    document.getElementById(`form-${paymentMethod}`).classList.remove('hidden');
                });
            });

            paymentOptions[0].click();

            // Date formatting for inputs (remains the same)
            const fechaInput = document.getElementById('fecha');
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0];
            fechaInput.setAttribute('min', formattedDate);
            fechaInput.value = formattedDate;

            // Time formatting (remains the same)
            const horaInput = document.getElementById('hora');
            horaInput.value = '12:00';
        });
