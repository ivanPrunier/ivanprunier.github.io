// Local storage utils
function set(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
}

function get(key) {
    return JSON.parse(window.localStorage.getItem(key))
}

function remove(key) {
    window.localStorage.removeItem(key)
}

// Add and remove paid and used
function addPaid(id) {
    const students = get('students')
    const studentsNew = students.map(student => student.id == id ? { ...student, paid: student.paid + 1} : student)
    set('students', studentsNew)
}

function removePaid(id) {
    const students = get('students')
    const studentsNew = students.map(student => student.id == id ? { ...student, paid: student.paid - 1} : student)
    set('students', studentsNew)
}

function addUsed(id) {
    const students = get('students')
    const studentsNew = students.map(student => student.id == id ? { ...student, used: student.used + 1} : student)
    set('students', studentsNew)
}

function removeUsed(id) {
    const students = get('students')
    const studentsNew = students.map(student => student.id == id ? { ...student, used: student.used - 1} : student)
    set('students', studentsNew)
}


function reDraw(studentId) {
    const students = get('students')
    const student = students.filter(student => student.id == studentId)[0]
    const remainingCell = document.querySelector(`[data-remaining-cell-id="${studentId}"]`)
    remainingCell.innerHTML = student.paid - student.used

    remaining = student.paid - student.used
    document.getElementById('modal-paid-cell').innerHTML = student.paid
    document.getElementById('modal-used-cell').innerHTML = student.used
    document.getElementById('modal-remaining-cell').innerHTML = remaining

    document.getElementById('modal-remaining-cell').parentElement.classList.remove('table-danger', 'table-success')
    document.getElementById('modal-remaining-cell').parentElement.classList.add(remaining < 0 ? 'table-danger' : 'table-success')
}


// Modal
const modal = document.getElementById('student-modal')
modal.addEventListener('show.bs.modal', event => {
    const students = get('students')

    const button = event.relatedTarget
    
    const studentId = button.getAttribute('data-bs-student-id')
    const student = students.filter(student => student.id == studentId)[0]

    document.getElementById('modal-title').innerHTML = student.lastName + ' ' + student.firstName
    document.getElementById('phone-number-container').innerHTML = ' ' + student.number
    document.getElementById('phone-number-link').href = 'tel:' + student.number

    remaining = student.paid - student.used
    document.getElementById('modal-paid-cell').innerHTML = student.paid
    document.getElementById('modal-used-cell').innerHTML = student.used
    document.getElementById('modal-remaining-cell').innerHTML = remaining

    document.getElementById('modal-remaining-cell').parentElement.classList.remove('table-danger', 'table-success')
    document.getElementById('modal-remaining-cell').parentElement.classList.add(remaining < 0 ? 'table-danger' : 'table-success')

    document.querySelectorAll('#student-modal-body button').forEach(elem => elem.setAttribute('data-student-id', studentId))
})

// Add and remove buttons events
document.querySelectorAll('#student-modal-body button').forEach(elem => {
    elem.addEventListener('click', event => {
        elem = event.target
        if (elem.tagName != "BUTTON") {
            elem = elem.parentElement.closest('button')
        } 

        const studentId = elem.getAttribute('data-student-id')
        const action = elem.getAttribute('data-action')

        if (action == 'add-paid') {
            addPaid(studentId)
        } else if (action == 'rm-paid') {
            removePaid(studentId)
        } else if (action == 'add-used') {
            addUsed(studentId)
        } else if (action == 'rm-used') {
            removeUsed(studentId)
        }

        reDraw(studentId)
    })
})

// Populate table
const students = get('students') || []
students.sort((a, b) => a.lastName.localeCompare(b.lastName));

const table = document.getElementById('student-list')

students.forEach(student => {
    const row = table.insertRow()
    let lastNameCell = row.insertCell(0)
    let firstNameCell = row.insertCell(1)
    let remainingCell = row.insertCell(2)
    let actionsCell = row.insertCell(3)

    lastNameCell.innerHTML = student.lastName
    firstNameCell.innerHTML = student.firstName
    remainingCell.innerHTML = student.paid - student.used
    actionsCell.innerHTML = `<button class="btn btn-outline-warning" data-bs-toggle="modal" data-bs-target="#student-modal" data-bs-student-id=${student.id}><i data-feather="log-in"></i></button>`

    remainingCell.setAttribute('data-remaining-cell-id', student.id)
})


function addStudent() {
    const students = get('students') || []
    const lastName = document.getElementById('add-student-last-name').value
    const firstName = document.getElementById('add-student-first-name').value
    const number = document.getElementById('add-student-number').value

    const student = {
        id: students.length + 1,
        lastName: lastName,
        firstName: firstName,
        number: number,
        paid: 0,
        used: 0
    }

    students.push(student)
    set('students', students)

    setTimeout(window.location.reload(), 1000)
}

function downloadBackup() {
    const students = get('students') || []
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(students));
    let dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "sauvegarde.json");
    dlAnchorElem.click();
}

// Activate icons
feather.replace()