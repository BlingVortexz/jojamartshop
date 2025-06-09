document.addEventListener('DOMContentLoaded', function() {
    const scriptElement = document.createElement('script');
    scriptElement.src = 'header.js';
    document.head.appendChild(scriptElement);

    const diamondCards = document.querySelectorAll('.diamond-card');
    let selectedCard = null;
    
    diamondCards.forEach(card => {
        card.addEventListener('click', function() {
            if (selectedCard) {
                selectedCard.classList.remove('selected');
            }
            
            selectedCard = card;
            card.classList.add('selected');
            
            const packageName = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            const hasDiscount = card.querySelector('.discount-badge') !== null;
            const discountText = hasDiscount ? card.querySelector('.discount-badge').textContent : '';
            
            const diamondMatch = packageName.match(/(\d+)\s*\((\d+)\+(\d+)\)/);
            let totalDiamonds = 0;
            let baseDiamonds = 0;
            let bonusDiamonds = 0;

            if (diamondMatch) {
                totalDiamonds = parseInt(diamondMatch[1]);
                baseDiamonds = parseInt(diamondMatch[2]);
                bonusDiamonds = parseInt(diamondMatch[3]);
            } else if (packageName.includes('Weekly')) {
                totalDiamonds = 'Weekly Pass';
            }

            const packageDetails = {
                name: packageName,
                price: price,
                hasDiscount: hasDiscount,
                discountText: discountText,
                totalDiamonds: totalDiamonds,
                baseDiamonds: baseDiamonds,
                bonusDiamonds: bonusDiamonds
            };
            sessionStorage.setItem('selectedPackage', JSON.stringify(packageDetails));
            const notification = document.createElement('div');
            notification.className = 'notification success';
            notification.innerHTML = `
                Selected Package:<br>
                ${packageName}<br>
                ${price}
                ${hasDiscount ? `<br>${discountText}` : ''}
            `;
            document.body.appendChild(notification);
            setTimeout(() => {
                notification.remove();
            }, 3000);
        
            card.style.transform = 'scale(0.95)';
            card.style.transition = 'transform 0.2s ease';
            
            setTimeout(() => {
                window.location.href = 'payment.html';
            }, 500);
        });
        card.addEventListener('mouseenter', function() {
            if (this !== selectedCard) {
                this.style.transform = 'translateY(-5px)';
            }
        });

        card.addEventListener('mouseleave', function() {
            if (this !== selectedCard) {
                this.style.transform = 'translateY(0)';
            }
        });
    });

    const style = document.createElement('style');
    style.textContent = `
        .diamond-card.selected {
            border: 2px solid var(--secondary-color);
            box-shadow: 0 0 20px rgba(65, 105, 225, 0.3);
            transform: scale(1.02);
        }

        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            z-index: 1000;
            animation: slideIn 0.5s ease;
            background: linear-gradient(45deg, var(--secondary-color), var(--accent-blue));
            backdrop-filter: blur(5px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            line-height: 1.5;
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}); 