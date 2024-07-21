document.addEventListener('DOMContentLoaded', () => {
    // Initialize Materialize dropdown
    M.Dropdown.init(document.querySelectorAll('.dropdown-trigger'), {});

    fetch('/userstage/progress')
        .then(response => response.json())
        .then(data => {
            const userProgressDiv = document.getElementById('userProgress');
            const dropdownContent = document.getElementById('dropdown1');

            // Group progress data by userId and calculate total points
            const groupedData = data.reduce((acc, curr) => {
                if (!acc[curr.userId]) {
                    acc[curr.userId] = {
                        userName: curr.User.nama, // Assuming 'nama' is the user's name field
                        progress: [],
                        totalPoints: 0,
                    };
                }
                acc[curr.userId].progress.push(curr);
                acc[curr.userId].totalPoints += curr.progressPoint;
                return acc;
            }, {});

            // Sort groupedData by totalPoints (if needed)
            const sortedUsers = Object.values(groupedData).sort((a, b) => b.totalPoints - a.totalPoints);

            // Populate dropdown menu
            sortedUsers.forEach((user, index) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="#!" data-index="${index}">Peringkat ${index + 1} ${user.userName}</a>`;
                dropdownContent.appendChild(listItem);
            });

            // Show the selected user's table
            dropdownContent.addEventListener('click', (event) => {
                if (event.target.tagName === 'A') {
                    const index = event.target.dataset.index;
                    showUserTable(sortedUsers[index]);
                }
            });

            function showUserTable(user) {
                userProgressDiv.innerHTML = '';

                const userRankingDiv = document.createElement('div');
                userRankingDiv.className = 'user-ranking';

                const userCaption = document.createElement('div');
                userCaption.className = 'user-caption';
                userCaption.innerHTML = `Peringkat ${sortedUsers.indexOf(user) + 1} <span>${user.userName}</span>`;

                const userTable = document.createElement('table');
                userTable.className = 'highlight user-table';
                userTable.innerHTML = `
                    <thead>
                        <tr>
                            <th>Stage</th>
                            <th>Point</th>
                            <th>Tanggal Pengerjaan</th>
                        </tr>
                    </thead>
                    <tbody>
                `;

                user.progress.forEach(progress => {
                    userTable.innerHTML += `
                        <tr>
                            <td>${progress.stageId}</td>
                            <td>${progress.progressPoint}</td>
                            <td>${new Date(progress.createdAt).toLocaleDateString()}</td>
                        </tr>
                    `;
                });

                userTable.innerHTML += `</tbody>`;
                userRankingDiv.appendChild(userCaption);
                userRankingDiv.appendChild(userTable);
                userProgressDiv.appendChild(userRankingDiv);
            }
        })
        .catch(error => console.error('Error fetching progress data:', error));
});
