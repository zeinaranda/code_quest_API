document.addEventListener('DOMContentLoaded', () => {
    fetch('/userstage/progress')
        .then(response => response.json())
        .then(data => {
            const userProgressDiv = document.getElementById('userProgress');
            
            data.forEach(user => {
                // Buat div untuk user
                const userDiv = document.createElement('div');
                userDiv.className = 'user-div';
                
                // Buat tabel untuk user
                const userTable = document.createElement('table');
                userTable.className = 'highlight user-table';
                userTable.innerHTML = `
                    <thead>
                        <tr>
                            <th>Materi Pembelajaran</th>
                            <th>sub CPMK</th>
                            <th>tes</th>
                            <th>Ujian</th>
                        </tr>
                    </thead>
                    <tbody>
                `;
                
                // Tambah data dari user ke tabel
                userTable.innerHTML += `
                    <tr>
                        <td rowspan="2">Materi ${user.stageId}</td>
                        <td>Deskripsi sub CPMK untuk materi ${user.stageId}</td>
                        <td>${user.testPoints}</td>
                        <td>${user.ujianPoints}</td>
                    </tr>
                    <tr class="sub-row">
                        <td>Penjelasan sub CPMK lebih lanjut</td>
                        <td>${user.testPoints / 2}</td> <!-- Sesuaikan logika ini jika diperlukan -->
                        <td></td>
                    </tr>
                `;
                
                userTable.innerHTML += `</tbody>`;
                userDiv.appendChild(userTable);
                userProgressDiv.appendChild(userDiv);
            });
        })
        .catch(error => console.error('Error fetching progress data:', error));
});
