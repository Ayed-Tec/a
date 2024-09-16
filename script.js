document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('interactive-table');
    const addRowButton = document.getElementById('add-row');
    const addColumnButton = document.getElementById('add-column');
    const toggleEditButton = document.getElementById('toggle-edit');
    const closeEditButton = document.getElementById('close-edit');
    const newPageButton = document.getElementById('new-page');
    const datetimeDisplay = document.getElementById('datetime');
    const titleInput = document.getElementById('table-title');

    let isEditing = true;
    let clickCounts = new Map(); // لتخزين عدد النقرات لكل خلية

    function updateDatetime() {
        const now = new Date();
        datetimeDisplay.textContent = `التاريخ والوقت: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    }

    function toggleEditing() {
        const cells = table.querySelectorAll('td');
        cells.forEach(cell => {
            cell.contentEditable = isEditing;
        });
        if (isEditing) {
            toggleEditButton.textContent = 'تبديل وضع التحرير';
        } else {
            toggleEditButton.textContent = 'تبديل وضع التحرير (محرر)';
        }
        isEditing = !isEditing;
    }

    function addRow() {
        const rows = table.querySelectorAll('tbody tr');
        if (rows.length > 0) {
            const cols = rows[0].children.length;
            const newRow = table.querySelector('tbody').insertRow();
            for (let i = 0; i < cols; i++) {
                const newCell = newRow.insertCell();
                newCell.contentEditable = isEditing;
                newCell.textContent = `خانة جديدة ${i + 1}`;
                newCell.style.backgroundColor = '#fff'; // تعيين اللون الأصلي
            }
        }
    }

    function addColumn() {
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const newCell = row.insertCell();
            newCell.contentEditable = isEditing;
            newCell.textContent = 'خانة جديدة';
            newCell.style.backgroundColor = '#fff'; // تعيين اللون الأصلي
        });
        const header = table.querySelector('thead tr');
        const newHeader = document.createElement('th');
        newHeader.textContent = `العمود ${header.children.length + 1}`;
        header.appendChild(newHeader);
    }

    function handleClick(event) {
        if (event.target.tagName === 'TD') {
            const cell = event.target;
            const currentColor = cell.style.backgroundColor;

            // عدد النقرات للخلية
            let count = clickCounts.get(cell) || 0;
            count = (count + 1) % 3; // التبديل بين 0 و 1 و 2

            // تعيين اللون بناءً على عدد النقرات
            if (count === 0) {
                cell.style.backgroundColor = 'red'; // النقرة الأولى
            } else if (count === 1) {
                cell.style.backgroundColor = 'orange'; // النقرة الثانية
            } else {
                cell.style.backgroundColor = '#fff'; // النقرة الثالثة (اللون الأصلي)
            }

            clickCounts.set(cell, count);
        }
    }

    function createNewPage() {
        const redCells = Array.from(table.querySelectorAll('td'))
            .filter(cell => cell.style.backgroundColor === 'red')
            .map(cell => cell.textContent)
            .join('<br>');

        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();

        const newWindow = window.open('', '_blank');
        newWindow.document.write('<html><head><title>جدول جديد</title></head><body>');
        newWindow.document.write(`<h1>جدول جديد</h1>`);
        newWindow.document.write(`<p>تاريخ الإنشاء: ${formattedDate}</p>`);
        newWindow.document.write(`<p>وقت الإنشاء: ${formattedTime}</p>`);
        newWindow.document.write('<h2>الغائبون:</h2>');
        newWindow.document.write(`<p>${redCells || 'لا توجد خلايا باللون الأحمر'}</p>`);
        newWindow.document.write('<table border="1" style="width: 100%; border-collapse: collapse;">');
        newWindow.document.write('<thead><tr><th>العمود 1</th><th>العمود 2</th></tr></thead>');
        newWindow.document.write('<tbody>');
        newWindow.document.write('<tr><td>خانة 1</td><td>خانة 2</td></tr>');
        newWindow.document.write('</tbody></table>');
        newWindow.document.write('</body></html>');
        newWindow.document.close();
    }

    table.addEventListener('click', handleClick);

    table.addEventListener('focusin', (event) => {
        if (event.target.tagName === 'TD') {
            event.target.style.backgroundColor = '#e0f7fa';
        }
    });

    table.addEventListener('focusout', (event) => {
        if (event.target.tagName === 'TD') {
            event.target.style.backgroundColor = '';
        }
    });

    table.addEventListener('input', (event) => {
        if (event.target.tagName === 'TD') {
            console.log(`تم تعديل الخانة: ${event.target.innerText}`);
        }
    });

    addRowButton.addEventListener('click', addRow);
    addColumnButton.addEventListener('click', addColumn);
    toggleEditButton.addEventListener('click', toggleEditing);
    closeEditButton.addEventListener('click', () => {
        isEditing = false;
        toggleEditing();
    });
    newPageButton.addEventListener('click', createNewPage);

    // تحديث التاريخ والوقت كل ثانية
    setInterval(updateDatetime, 1000);
});
