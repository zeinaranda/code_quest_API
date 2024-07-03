document.addEventListener('DOMContentLoaded', () => {
    fetch('/userstage/progress')
        .then(response => response.json())
        .then(data => {
            const userProgressDiv = document.getElementById('userProgress');

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

            sortedUsers.forEach((user, index) => {
                const userTable = document.createElement('table');
                userTable.innerHTML = `
                    <caption>Peringkat ${index + 1} ${user.userName}</caption>
                    <tr>
                        <th>Stage</th>
                        <th>Point</th>
                        <th>Tanggal Pengerjaan</th>
                    </tr>
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

                userProgressDiv.appendChild(userTable);
            });
        })
        .catch(error => console.error('Error fetching progress data:', error));
});
