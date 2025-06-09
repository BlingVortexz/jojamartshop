document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.payment-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const confirmButton = document.getElementById('confirmPayment');
    let currentStep = 0;

    const gameIdInput = document.getElementById('gameId');
    const serverIdInput = document.getElementById('serverId');
    const nicknameInput = document.getElementById('nickname');
    const paymentMethods = document.getElementsByName('paymentMethod');

    const confirmGameId = document.getElementById('confirmGameId');
    const confirmServerId = document.getElementById('confirmServerId');
    const confirmNickname = document.getElementById('confirmNickname');
    const confirmPackage = document.getElementById('confirmPackage');
    const confirmPrice = document.getElementById('confirmPrice');
    const confirmPaymentMethod = document.getElementById('confirmPaymentMethod');

    const diamondCards = document.querySelectorAll('.diamond-card');

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.remove('active');
            progressSteps[index].classList.remove('active');
        });
        steps[stepIndex].classList.add('active');
        for (let i = 0; i <= stepIndex; i++) {
            progressSteps[i].classList.add('active');
        }
        currentStep = stepIndex;
    }

    function validateStep(step) {
        if (step === 0) {
            return gameIdInput.value && serverIdInput.value && nicknameInput.value;
        } else if (step === 1) {
            return Array.from(paymentMethods).some(method => method.checked);
        }
        return true;
    }

    function updateConfirmation() {
        confirmGameId.textContent = gameIdInput.value;
        confirmServerId.textContent = serverIdInput.value;
        confirmNickname.textContent = nicknameInput.value;
        
        const selectedMethod = Array.from(paymentMethods).find(method => method.checked);
        if (selectedMethod) {
            confirmPaymentMethod.textContent = selectedMethod.parentElement.querySelector('.method-name').textContent;
        }

        confirmPackage.textContent = document.getElementById('selectedPackage').textContent;
        confirmPrice.textContent = document.getElementById('packagePrice').textContent;
    }

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    showStep(currentStep + 1);
                    if (currentStep === steps.length - 2) {
                        updateConfirmation();
                    }
                }
            } else {
                alert('Please fill in all required fields.');
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });

    if (diamondCards.length > 0) {
        diamondCards.forEach(card => {
            card.addEventListener('click', () => {
                diamondCards.forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                const packageElement = document.getElementById('selectedPackage');
                const priceElement = document.getElementById('packagePrice');
                
                if (packageElement && priceElement) {
                    packageElement.textContent = card.querySelector('h3').textContent;
                    priceElement.textContent = card.querySelector('.price').textContent;
                }
            });
        });
    }

    gameIdInput?.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    serverIdInput?.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
    });

    confirmButton?.addEventListener('click', async () => {
        try {
            confirmButton.disabled = true;
            confirmButton.textContent = 'Processing...';

            await new Promise(resolve => setTimeout(resolve, 2000));

            alert('Payment successful! Your diamonds will be credited to your account shortly.');
            
            document.querySelectorAll('form').forEach(form => form.reset());
            showStep(0);
        } catch (error) {
            alert('Payment failed. Please try again.');
        } finally {
            confirmButton.disabled = false;
            confirmButton.textContent = 'Confirm Payment';
        }
    });

    showStep(0);
}); 