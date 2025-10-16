// Player data with images
let players = [
    { id: 1, name: "Bobby Hurley", assists: 1076, team: "Duke", color: "#003087", isRecord: true, image: "hurlye.png" },
    { id: 3, name: "Chr is Chor chi a ni", assists: 1030, team: "North Carolina", color: "#7BAFD4", image: "chorchi.png" },
    { id: 3, name: "Ed Cota", assists: 1030, team: "North Carolina", color: "#7BAFD4", image: "cota.png" },
    { id: 5, name: "jason Brickman", assists: 1009, team: "East Tennessee State", color: "#041E42", image: "brickman.png" },
    { id: 7, name: "Sherman Douglas", assists: 960, team: "Syracuse", color: "#F76900", image: "she rman douglas.png" },
    { id: 6, name: "gary payton", assists: 939, team: "Maryland", color: "#E03A3E", image: "gary payton.png" },
    { id: 6, name: "Steve Blake", assists: 927, team: "Maryland", color: "#E03A3E", image: "steve blake.png" },
    { id: 8, name: "AVER JOHNSON", assists: 956, team: "Marquette", color: "#003876", image: "avery johnson.png" },
    { id: 9, name: "TJ FORD", assists: 954, team: "Kansas", color: "#0051BA", image: "ford.png" },
    { id: 10, name: "MARKQUIS NOWEL", assists: 950, team: "Nevada-Las Vegas", color: "#CF0A2C", image: "nowel.png" },
    { id: 11, name: "Braden Smith", assists: 758, team: "Purdue", color: "#CEB888", isTracking: true, image: "smith.png" }
];

const recordHolder = players.find(p => p.isRecord);
const maxAssists = recordHolder.assists;

// Chart data and configuration
let assistChart = null;
let animatedData = [];

// Real season progression data for Braden Smith
const chartData = [
    { season: '2020-21', assists: 156, gamesPlayed: 32, apg: 4.9, type: 'Freshman' },
    { season: '2021-22', assists: 295, gamesPlayed: 38, apg: 7.8, type: 'Sophomore' },
    { season: '2022-23', assists: 449, gamesPlayed: 37, apg: 12.1, type: 'Junior' },
    { season: '2023-24', assists: 758, gamesPlayed: 35, apg: 21.7, type: 'Senior' }
];

function updateStats() {
    const sorted = [...players].sort((a, b) => b.assists - a.assists);
    const tracked = players.find(p => p.isTracking);
    const currentRank = sorted.findIndex(p => p.isTracking) + 1;
    const nextPlayer = sorted[currentRank - 2];
    const assistsToRecord = recordHolder.assists - tracked.assists;
    const progressPercent = ((tracked.assists / maxAssists) * 100).toFixed(1);

    document.getElementById('currentRank').textContent = currentRank;
    document.getElementById('currentRank').classList.add('stat-animate');
    setTimeout(() => document.getElementById('currentRank').classList.remove('stat-animate'), 500);

    document.getElementById('totalAssists').textContent = tracked.assists;
    document.getElementById('toRecord').textContent = assistsToRecord;
    document.getElementById('nextTarget').textContent = nextPlayer ? nextPlayer.assists - tracked.assists : 0;
    document.getElementById('progressPercent').textContent = progressPercent + '%';
    document.getElementById('gamesNeeded').textContent = Math.ceil(assistsToRecord / 5.5);
    document.getElementById('nextMilestone').textContent = Math.ceil(tracked.assists / 100) * 100;
    document.getElementById('progressBar').style.width = progressPercent + '%';
}

// Add this to your script section

function renderCourt() {
    const container = document.getElementById('courtMarkers');
    const sorted = [...players].sort((a, b) => b.assists - a.assists);
    container.innerHTML = '';

    sorted.forEach((player, idx) => {
        const position = ((player.assists / maxAssists) * 100).toFixed(1);
        const rank = idx + 1;

        const marker = document.createElement('div');
        marker.className = 'player-marker absolute opacity-0';
        marker.style.left = position + '%';
        marker.style.bottom = '0';
        marker.style.transform = 'translateX(-50%)';
        marker.dataset.index = idx;

        const markerIcon = player.isRecord ? '👑' : player.isTracking ? '⭐' : rank;
        const markerClass = player.isTracking ? 'tracked-player ring-4 ring-yellow-400 scale-125' :
            player.isRecord ? 'ring-2 ring-amber-400' : 'ring-2 ring-slate-600';

        // Create player image element
        const playerImage = document.createElement('div');
        playerImage.className = 'player-image-container absolute -top-16 left-1/2 transform -translate-x-1/2';
        playerImage.innerHTML = `
      <div class="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-4 border-white shadow-xl ${markerClass}">
        <img src="${player.image}" alt="${player.name}" class="w-full h-full object-cover" 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-lg" style="display: none;">
          ${player.name.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
    `;

        marker.appendChild(playerImage);
        container.appendChild(marker);
    });

    // Setup Intersection Observer for scroll reveal
    observeCourtMarkers();
}

function observeCourtMarkers() {
    const container = document.getElementById('courtMarkers');

    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Container is visible, animate all markers
                const markers = entry.target.querySelectorAll('.player-marker');
                markers.forEach((marker, idx) => {
                    setTimeout(() => {
                        marker.classList.add('animate-reveal');
                    }, idx * 100); // Stagger animation by 100ms
                });
                // Stop observing once animation starts
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(container);
}

// Add this CSS to your stylesheet
const style = document.createElement('style');
style.textContent = `
  @keyframes revealSlide {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes revealScale {
    from {
      opacity: 0;
      transform: translateX(-50%) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) scale(1);
    }
  }

  .player-marker {
    transition: all 0.3s ease-out;
  }

  .animate-reveal {
    animation: revealScale 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
  }

  /* Alternative slide animation */
  .animate-reveal.slide {
    animation: revealSlide 0.5s ease-out forwards !important;
  }
`;
document.head.appendChild(style);

function renderLeaderboard() {
    const container = document.getElementById('leaderboard');
    const sorted = [...players].sort((a, b) => b.assists - a.assists);
    container.innerHTML = '';

    sorted.forEach((player, idx) => {
        const rank = idx + 1;
        const medals = ['🥇', '🥈', '🥉'];
        const rankDisplay = rank <= 3 ? medals[rank - 1] : rank;

        const cardClass = player.isTracking
            ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border-2 border-purple-500/50 shadow-lg shadow-purple-500/20'
            : player.isRecord
                ? 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30'
                : 'bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50';

        const row = document.createElement('div');
        row.className = `flex items-center gap-4 p-4 md:p-5 rounded-xl transition-all duration-300 ${cardClass} leaderboard-entry`;
        row.style.opacity = '0';
        row.style.transform = 'translateY(30px)';
        row.style.animationDelay = `${idx * 0.1}s`;

        row.innerHTML = `
          <div class="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center font-bold text-lg ${rank <= 3 ? 'bg-gradient-to-br from-yellow-400 to-amber-600' : 'bg-slate-600'
            } text-white shadow-lg rank-badge">
            ${typeof rankDisplay === 'number' ? rankDisplay : `<span class="text-2xl">${rankDisplay}</span>`}
          </div>
          
          <div class="flex items-center gap-3 flex-1 min-w-0">
            <div class="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-lg flex-shrink-0">
              <img src="${player.image}" alt="${player.name}" class="w-full h-full object-cover" 
                   onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
              <div class="w-full h-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-bold text-sm" style="display: none;">
                ${player.name.split(' ').map(n => n[0]).join('')}
              </div>
            </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
                <h3 class="font-bold text-white text-base md:text-lg truncate player-name">
                ${player.name}
              </h3>
                ${player.isTracking ? '<span class="text-yellow-400 text-xl animate-pulse">⭐</span>' : ''}
                ${player.isRecord ? '<span class="text-amber-400 text-xl animate-bounce">👑</span>' : ''}
            </div>
            <p class="text-gray-400 text-xs md:text-sm team-name">${player.team}</p>
            </div>
          </div>
          
          <div class="text-right">
            <p class="text-3xl md:text-4xl font-black text-white assist-number">${player.assists}</p>
            <p class="text-xs text-gray-400 uppercase tracking-wide">Assists</p>
          </div>
        `;

        container.appendChild(row);

        // Animate entry
        setTimeout(() => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
            row.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        }, idx * 100);
    });
}

function openModal() {
    document.getElementById('modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function setAssists(value) {
    document.getElementById('assistInput').value = value;
}

function createConfetti() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        celebration.appendChild(confetti);
    }

    document.body.appendChild(celebration);
    setTimeout(() => celebration.remove(), 5000);
}

function createFireworks() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.className = 'fireworks';
            firework.style.left = (Math.random() * 80 + 10) + '%';
            firework.style.top = (Math.random() * 60 + 20) + '%';
            document.body.appendChild(firework);
            setTimeout(() => firework.remove(), 1000);
        }, i * 200);
    }
}

function showMilestonePopup(message) {
    const popup = document.createElement('div');
    popup.className = 'milestone-popup';
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 2000);
}

// Undo functionality
let lastAssistChange = null;

function addAssists() {
    const value = parseInt(document.getElementById('assistInput').value) || 0;
    if (value > 0) {
        const tracked = players.find(p => p.isTracking);
        const oldAssists = tracked.assists;
        tracked.assists += value;

        // Store undo information
        lastAssistChange = {
            playerId: tracked.id,
            oldAssists: oldAssists,
            newAssists: tracked.assists,
            changeAmount: value
        };

        // Show undo button
        showUndoButton();

        // Check for milestones
        const milestones = [800, 900, 1000, 1100];
        const newMilestone = milestones.find(m => oldAssists < m && tracked.assists >= m);

        if (newMilestone) {
            showMilestonePopup(`🎉 ${newMilestone} Assists Milestone! 🎉`);
            createConfetti();
            createFireworks();
        }

        // Animate number changes
        animateNumberChange('totalAssists', oldAssists, tracked.assists);
        animateNumberChange('toRecord', recordHolder.assists - oldAssists, recordHolder.assists - tracked.assists);

        updateStats();
        renderCourt();
        renderLeaderboard();
        updateChart();
        closeModal();

        // Auto-refresh dashboard
        setTimeout(() => {
            updateStats();
            renderCourt();
            renderLeaderboard();
            updateChart();
        }, 2000);

        // Scroll to tracked player
        setTimeout(() => {
            const leaderboard = document.getElementById('leaderboard');
            const trackedRow = Array.from(leaderboard.children).find(el =>
                el.textContent.includes('Braden Smith')
            );
            if (trackedRow) {
                trackedRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }
}

function undoLastAssist() {
    if (lastAssistChange) {
        const tracked = players.find(p => p.id === lastAssistChange.playerId);
        if (tracked) {
            tracked.assists = lastAssistChange.oldAssists;

            // Animate number changes
            animateNumberChange('totalAssists', lastAssistChange.newAssists, tracked.assists);
            animateNumberChange('toRecord', recordHolder.assists - lastAssistChange.newAssists, recordHolder.assists - tracked.assists);

            updateStats();
            renderCourt();
            renderLeaderboard();
            updateChart();

            // Clear undo data
            lastAssistChange = null;
            hideUndoButton();

            // Show undo confirmation
            showUndoConfirmation();
        }
    }
}

function showUndoButton() {
    let undoBtn = document.getElementById('undoButton');
    if (!undoBtn) {
        undoBtn = document.createElement('button');
        undoBtn.id = 'undoButton';
        undoBtn.className = 'fixed top-20 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-all duration-300 z-50';
        undoBtn.innerHTML = '↶ Undo Last Assist';
        undoBtn.onclick = undoLastAssist;
        document.body.appendChild(undoBtn);
    }
    undoBtn.style.display = 'block';
    undoBtn.style.animation = 'slideIn 0.3s ease-out';
}

function hideUndoButton() {
    const undoBtn = document.getElementById('undoButton');
    if (undoBtn) {
        undoBtn.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            undoBtn.style.display = 'none';
        }, 300);
    }
}

function showUndoConfirmation() {
    const confirmation = document.createElement('div');
    confirmation.className = 'fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg font-bold z-50';
    confirmation.innerHTML = '✓ Assist Undone';
    document.body.appendChild(confirmation);

    setTimeout(() => {
        confirmation.remove();
    }, 2000);
}

function animateNumberChange(elementId, start, end) {
    const element = document.getElementById(elementId);
    const duration = 1000;
    const startTime = performance.now();

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(start + (end - start) * progress);

        element.textContent = current;
        element.classList.add('animate');

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            setTimeout(() => element.classList.remove('animate'), 600);
        }
    }

    requestAnimationFrame(updateNumber);
}

// Chart functions
function initChart() {
    const ctx = document.getElementById('assistChart').getContext('2d');

    // Animate data in progressively
    chartData.forEach((item, index) => {
        setTimeout(() => {
            animatedData.push(item);
            updateChart();
            updateSeasonBreakdown();
        }, index * 300);
    });

    assistChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: animatedData.map(d => d.season),
            datasets: [{
                label: 'Career Assists',
                data: animatedData.map(d => d.assists),
                borderColor: '#8b5cf6',
                backgroundColor: 'rgba(139, 92, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#8b5cf6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            }, {
                label: 'Assists Per Game',
                data: animatedData.map(d => d.apg),
                borderColor: '#ec4899',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                borderWidth: 2.5,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#ec4899',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderDash: [5, 5]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff',
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleColor: '#ffffff',
                    bodyColor: '#ffffff',
                    borderColor: '#8b5cf6',
                    borderWidth: 1,
                    cornerRadius: 8,
                    callbacks: {
                        title: function (context) {
                            const data = context[0].raw;
                            return context[0].label;
                        },
                        label: function (context) {
                            const data = chartData[context.dataIndex];
                            return [
                                `Total Assists: ${data.assists}`,
                                `Games: ${data.gamesPlayed}`,
                                `APG: ${data.apg}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(139, 92, 246, 0.1)',
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: '#9ca3af',
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: 'rgba(139, 92, 246, 0.1)',
                        drawBorder: false
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeInOutQuart'
            }
        }
    });
}

function updateChart() {
    if (assistChart) {
        const tracked = players.find(p => p.isTracking);
        // Update the current season data
        chartData[3].assists = tracked.assists;
        chartData[3].apg = (tracked.assists / 35).toFixed(1); // Assuming 35 games this season

        assistChart.data.labels = animatedData.map(d => d.season);
        assistChart.data.datasets[0].data = animatedData.map(d => d.assists);
        assistChart.data.datasets[1].data = animatedData.map(d => d.apg);
        assistChart.update('active');

        // Update header stats
        updateHeaderStats();
    }
}

function updateHeaderStats() {
    const tracked = players.find(p => p.isTracking);
    const recordNeeded = recordHolder.assists - tracked.assists;
    const careerAPG = (tracked.assists / 4).toFixed(1);

    document.getElementById('careerTotal').textContent = tracked.assists;
    document.getElementById('recordNeeded').textContent = recordNeeded;
    document.getElementById('careerAPG').textContent = careerAPG;
}

function updateSeasonBreakdown() {
    const container = document.getElementById('seasonBreakdown');
    container.innerHTML = '';

    animatedData.forEach((season, idx) => {
        const card = document.createElement('div');
        card.className = 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/20 rounded-lg p-4 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300';
        card.style.animation = `slideUp 0.6s ease-out ${idx * 150}ms both`;

        card.innerHTML = `
          <div class="flex items-center justify-between mb-2">
            <span class="text-purple-300 font-bold text-sm">${season.type}</span>
            <span class="text-amber-400 text-lg">📊</span>
          </div>
          <p class="text-white font-bold text-2xl mb-1">${season.assists}</p>
          <p class="text-gray-400 text-xs mb-2">${season.season}</p>
          <div class="flex justify-between text-xs">
            <span class="text-gray-500">${season.gamesPlayed} GP</span>
            <span class="text-pink-400 font-semibold">${season.apg} APG</span>
          </div>
        `;

        container.appendChild(card);
    });
}

// Initialize
document.getElementById('updateDate').textContent = new Date().toLocaleDateString();
updateStats();
renderCourt();
renderLeaderboard();
initChart();

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (adminPanel && adminPanel.classList.contains('active')) {
            closeAdminPanel();
        } else if (!document.getElementById('modal').classList.contains('hidden')) {
            closeModal();
        }
    }
});

// Close modal on backdrop click
document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
});

// Admin Panel Functionality
const ADMIN_PASSWORD = "admin1234";
const adminPanel = document.getElementById('adminPanel');
const passwordModal = document.getElementById('passwordModal');
const adminToggle = document.getElementById('adminToggle');
const adminClose = document.getElementById('adminClose');
const playerManagement = document.getElementById('playerManagement');

// Check if admin elements exist
if (!adminPanel || !adminClose) {
    console.error('Critical admin elements not found!');
}

// Admin access control
adminToggle.addEventListener('click', () => {
    passwordModal.classList.add('active');
});

document.getElementById('cancelPassword').addEventListener('click', () => {
    passwordModal.classList.remove('active');
    document.getElementById('adminPassword').value = '';
});

document.getElementById('submitPassword').addEventListener('click', () => {
    const password = document.getElementById('adminPassword').value;
    if (password === ADMIN_PASSWORD) {
        passwordModal.classList.remove('active');
        adminPanel.classList.add('active');
        document.getElementById('adminPassword').value = '';
        renderPlayerManagement();
    } else {
        alert('Incorrect password!');
        document.getElementById('adminPassword').value = '';
    }
});

// Function to close admin panel
function closeAdminPanel() {
    if (adminPanel) {
        adminPanel.classList.remove('active');
    }
}

// Admin close button functionality
if (adminClose) {
    adminClose.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeAdminPanel();
    });
} else {
    console.error('Admin close button not found!');
}

// Alternative close method using event delegation
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'adminClose') {
        e.preventDefault();
        e.stopPropagation();
        closeAdminPanel();
    }
});

// Close admin panel on backdrop click
if (adminPanel) {
    adminPanel.addEventListener('click', (e) => {
        if (e.target === adminPanel) {
            closeAdminPanel();
        }
    });
}

// Remove duplicate escape key handler - already handled above

// Password modal enter key
document.getElementById('adminPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        document.getElementById('submitPassword').click();
    }
});

// Render player management interface
function renderPlayerManagement() {
    playerManagement.innerHTML = '';

    players.forEach((player, index) => {
        const playerCard = document.createElement('div');
        playerCard.className = 'admin-card';
        playerCard.innerHTML = `
          <div class="admin-form">
            <input type="text" value="${player.name}" class="admin-input player-name-input" data-id="${player.id}" placeholder="Player Name">
            <input type="text" value="${player.team}" class="admin-input player-team-input" data-id="${player.id}" placeholder="Team">
            <input type="number" value="${player.assists}" class="admin-input player-assists-input" data-id="${player.id}" min="0" placeholder="Assists">
            <input type="url" value="${player.image || ''}" class="admin-input player-image-input" data-id="${player.id}" placeholder="Image URL">
            <button class="admin-btn btn-update" onclick="updatePlayer('${player.id}')">Update</button>
            <button class="admin-btn btn-delete" onclick="deletePlayer('${player.id}')">Delete</button>
          </div>
        `;
        playerManagement.appendChild(playerCard);
    });
}

// Update player function
function updatePlayer(playerId) {
    const playerIndex = players.findIndex(p => p.id === playerId);
    if (playerIndex === -1) return;

    const nameInput = document.querySelector(`.player-name-input[data-id="${playerId}"]`);
    const teamInput = document.querySelector(`.player-team-input[data-id="${playerId}"]`);
    const assistsInput = document.querySelector(`.player-assists-input[data-id="${playerId}"]`);
    const imageInput = document.querySelector(`.player-image-input[data-id="${playerId}"]`);

    const newName = nameInput.value.trim();
    const newTeam = teamInput.value.trim();
    const newAssists = parseInt(assistsInput.value) || 0;
    const newImage = imageInput.value.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=random`;

    if (!newName) {
        alert('Player name cannot be empty!');
        return;
    }

    if (newAssists < 0) {
        alert('Assists cannot be negative!');
        return;
    }

    // Update player data
    players[playerIndex] = {
        ...players[playerIndex],
        name: newName,
        team: newTeam,
        assists: newAssists,
        image: newImage
    };

    // Update the main dashboard
    updateStats();
    renderCourt();
    renderLeaderboard();

    // Show success feedback
    const updateBtn = document.querySelector(`.btn-update[onclick="updatePlayer('${playerId}')"]`);
    const originalText = updateBtn.textContent;
    updateBtn.textContent = '✓ Updated!';
    updateBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

    setTimeout(() => {
        updateBtn.textContent = originalText;
        updateBtn.style.background = '';
    }, 2000);
}

// Delete player function
function deletePlayer(playerId) {
    if (confirm('Are you sure you want to delete this player?')) {
        const playerIndex = players.findIndex(p => p.id === playerId);
        if (playerIndex === -1) return;

        const playerName = players[playerIndex].name;
        players.splice(playerIndex, 1);

        // Update the main dashboard
        updateStats();
        renderCourt();
        renderLeaderboard();
        renderPlayerManagement();

        // Show success feedback
        alert(`${playerName} has been deleted successfully!`);
    }
}

// Add new player functionality
document.getElementById('addNewPlayer').addEventListener('click', () => {
    const nameInput = document.getElementById('newPlayerName');
    const teamInput = document.getElementById('newPlayerTeam');
    const assistsInput = document.getElementById('newPlayerAssists');
    const imageInput = document.getElementById('newPlayerImage');

    const name = nameInput.value.trim();
    const team = teamInput.value.trim();
    const assists = parseInt(assistsInput.value) || 0;
    const image = imageInput.value.trim() || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

    // Validation
    if (!name) {
        alert('Player name is required!');
        nameInput.focus();
        return;
    }

    if (assists < 0) {
        alert('Assists cannot be negative!');
        assistsInput.focus();
        return;
    }

    // Check if player already exists
    if (players.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        alert('A player with this name already exists!');
        nameInput.focus();
        return;
    }

    // Add new player
    const newPlayer = {
        id: 'player_' + Date.now(),
        name: name,
        team: team || 'Unknown Team',
        assists: assists,
        image: image,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
    };

    players.push(newPlayer);

    // Update the main dashboard
    updateStats();
    renderCourt();
    renderLeaderboard();
    renderPlayerManagement();

    // Clear form
    nameInput.value = '';
    teamInput.value = '';
    assistsInput.value = '';
    imageInput.value = '';

    // Show success feedback
    const addBtn = document.getElementById('addNewPlayer');
    const originalText = addBtn.textContent;
    addBtn.textContent = '✓ Added!';
    addBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

    setTimeout(() => {
        addBtn.textContent = originalText;
        addBtn.style.background = '';
    }, 2000);

    alert(`${name} has been added successfully!`);
});

// Enter key support for add player form
document.getElementById('newPlayerName').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('addNewPlayer').click();
});

document.getElementById('newPlayerTeam').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('addNewPlayer').click();
});

document.getElementById('newPlayerAssists').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') document.getElementById('addNewPlayer').click();
});