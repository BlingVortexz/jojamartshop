document.addEventListener('DOMContentLoaded', function() {
    function setupInputValidation() {
        const gameIdInput = document.getElementById('gameId');
        const serverIdInput = document.getElementById('serverId');

        if (gameIdInput) {
            gameIdInput.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                
                if (value.length > 10) {
                    value = value.slice(0, 10);
                }
                
                this.value = value;
                
                if (value.length < 8) {
                    this.setCustomValidity('Game ID must be 8-10 numbers');
                } else {
                    this.setCustomValidity('');
                }
            });
        }

        if (serverIdInput) {
            serverIdInput.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                if (value.length > 5) {
                    value = value.slice(0, 5);
                }
                
                this.value = value;
                if (value.length < 3) {
                    this.setCustomValidity('Server ID must be 3-5 numbers');
                } else {
                    this.setCustomValidity('');
                }
            });
        }
    }

    setupInputValidation();

    const selectedPackage = JSON.parse(sessionStorage.getItem('selectedPackage'));
    
    if (selectedPackage) {
        const orderSummary = document.querySelector('.order-summary');
        if (orderSummary) {
            orderSummary.innerHTML = `
                <h3>Order Summary</h3>
                <p>Selected Package: <span>${selectedPackage.name}</span></p>
                ${selectedPackage.totalDiamonds !== 'Weekly Pass' ? `
                    <p>Base Diamonds: <span>${selectedPackage.baseDiamonds} 💎</span></p>
                    <p>Bonus Diamonds: <span>${selectedPackage.bonusDiamonds} 💎</span></p>
                    <p>Total Diamonds: <span>${selectedPackage.totalDiamonds} 💎</span></p>
                ` : ''}
                <p>Price: <span>${selectedPackage.price}</span></p>
                ${selectedPackage.hasDiscount ? `
                    <p>Discount: <span>${selectedPackage.discountText}</span></p>
                ` : ''}
            `;
        }
    } else {
        window.location.href = 'home.html';
    }

    let currentStep = 1;
    const totalSteps = 3;

    function updateSteps() {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            if (index + 1 === currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        document.querySelectorAll('.payment-step').forEach((form, index) => {
            if (index + 1 === currentStep) {
                form.classList.add('active');
            } else {
                form.classList.remove('active');
            }
        });
    }

    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            let canProceed = true;

            if (currentStep === 1) {
                const gameId = document.getElementById('gameId');
                const serverId = document.getElementById('serverId');
                const nickname = document.getElementById('nickname');

                if (gameId.value.length < 8 || gameId.value.length > 10) {
                    gameId.setCustomValidity('Game ID must be 8-10 numbers');
                    canProceed = false;
                }
                if (serverId.value.length < 3 || serverId.value.length > 5) {
                    serverId.setCustomValidity('Server ID must be 3-5 numbers');
                    canProceed = false;
                }
                if (!nickname.value) {
                    nickname.setCustomValidity('Nickname is required');
                    canProceed = false;
                }

                if (canProceed) {
                    document.getElementById('confirmGameId').textContent = gameId.value;
                    document.getElementById('confirmServerId').textContent = serverId.value;
                    document.getElementById('confirmNickname').textContent = nickname.value;
                    document.getElementById('confirmPackage').textContent = selectedPackage.name;
                    document.getElementById('confirmPrice').textContent = selectedPackage.price;
                }
            }

            if (canProceed && currentStep < totalSteps) {
                currentStep++;
                updateSteps();
            }
        });
    });

    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep > 1) {
                currentStep--;
                updateSteps();
            }
        });
    });
    const confirmButton = document.getElementById('confirmPayment');
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            alert('Payment confirmed! Your diamonds will be sent shortly.');
            window.location.href = 'home.html';
        });
    }

    const style = document.createElement('style');
    style.textContent = `
        .payment-step {
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .payment-step.active {
            display: block;
            opacity: 1;
        }

        .progress-step {
            position: relative;
            z-index: 2;
            text-align: center;
        }

        .step-number {
            width: 40px;
            height: 40px;
            background: var(--primary-color);
            border: 2px solid var(--secondary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 0.5rem;
            color: var(--text-color);
            font-weight: bold;
            transition: all 0.3s ease;
        }

        .progress-step.active .step-number {
            background: var(--secondary-color);
            color: var(--primary-color);
        }

        .qris-container {
            text-align: center;
            padding: 2rem;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
            margin: 2rem 0;
        }

        .qris-code {
            max-width: 300px;
            margin-bottom: 1rem;
        }

        .qris-instructions {
            color: var(--text-color);
            line-height: 1.8;
            margin-top: 1rem;
        }

        .button-group {
            display: flex;
            gap: 1rem;
            justify-content: space-between;
            margin-top: 2rem;
        }

        .confirmation-details {
            display: grid;
            gap: 2rem;
            margin: 2rem 0;
        }

        .detail-group {
            background: rgba(255, 255, 255, 0.1);
            padding: 1.5rem;
            border-radius: 10px;
        }

        .detail-group h3 {
            color: var(--secondary-color);
            margin-bottom: 1rem;
        }

        .detail-group p {
            margin: 0.5rem 0;
            display: flex;
            justify-content: space-between;
        }

        input:invalid {
            border-color: #ff4444;
        }

        input:invalid + .error-message {
            color: #ff4444;
            font-size: 0.8rem;
            margin-top: 4px;
        }
    `;
    document.head.appendChild(style);
}); 