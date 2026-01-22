// Mengambil elemen layar dan semua tombol
const display = document.querySelector('.display');
const buttons = document.querySelectorAll('.btn');

// Variabel untuk menyimpan status kalkulator
let currentNumber = '0';      // Angka yang sedang diketik/ditampilkan
let previousNumber = '';      // Angka yang disimpan sebelum operasi
let operator = null;          // Operator matematika (+, -, *, /)
let waitingForSecondOperand = false; // Penanda apaka kita selesai menekan operator

// Fungsi untuk memperbarui layar
const updateDisplay = () => {
    display.innerText = currentNumber;
};

// Fungsi untuk menangani input angka
const inputDigit = (digit) => {
    if (waitingForSecondOperand) {
        // Jika baru saja menekan operator, ganti angka di layar dengan angka baru
        currentNumber = digit;
        waitingForSecondOperand = false;
    } else {
        // Jika angka saat ini '0', ganti dengan angka baru, jika tidak, tambahkan di belakangnya
        currentNumber = currentNumber === '0' ? digit : currentNumber + digit;
    }
};

// Fungsi untuk menangani desimal (titik)
const inputDecimal = () => {
    // Jika angka belum memiliki titik, tambahkan
    if (!currentNumber.includes('.')) {
        currentNumber += '.';
    }
};

// Fungsi untuk menangani operator (+, -, x, ÷)
const handleOperator = (nextOperator) => {
    const inputValue = parseFloat(currentNumber);

    if (operator && waitingForSecondOperand) {
        operator = nextOperator;
        return;
    }

    if (previousNumber === '') {
        previousNumber = inputValue;
    } else if (operator) {
        const result = calculate(previousNumber, inputValue, operator);
        currentNumber = String(result);
        previousNumber = result;
    }

    waitingForSecondOperand = true;
    operator = nextOperator;
};

// Fungsi logika perhitungan matematika
const calculate = (first, second, op) => {
    if (op === '+') return first + second;
    if (op === '−') return first - second; // Perhatikan karakter minus dari HTML
    if (op === '×') return first * second; // Perhatikan karakter kali dari HTML
    if (op === '÷') return first / second; // Perhatikan karakter bagi dari HTML
    return second;
};

// Fungsi Reset (AC)
const resetCalculator = () => {
    currentNumber = '0';
    previousNumber = '';
    operator = null;
    waitingForSecondOperand = false;
};

// Fungsi Ubah Tanda (+/-)
const toggleSign = () => {
    currentNumber = String(parseFloat(currentNumber) * -1);
};

// Fungsi Persen (%)
const inputPercent = () => {
    currentNumber = String(parseFloat(currentNumber) / 100);
};

// Event Listener untuk setiap tombol
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        const target = event.target;
        const value = target.innerText;

        // Cek tombol mana yang ditekan berdasarkan isinya
        if (target.classList.contains('operator')) {
            // Jika tombol sama dengan '=', hitung hasil akhir
            if (value === '=') {
                if (operator && previousNumber !== '') {
                    currentNumber = String(calculate(previousNumber, parseFloat(currentNumber), operator));
                    previousNumber = '';
                    operator = null;
                    waitingForSecondOperand = true;
                }
            } else {
                handleOperator(value);
            }
            updateDisplay();
            return;
        }

        if (value === 'AC') {
            resetCalculator();
            updateDisplay();
            return;
        }

        if (value === '+/-') {
            toggleSign();
            updateDisplay();
            return;
        }

        if (value === '%') {
            inputPercent();
            updateDisplay();
            return;
        }

        if (value === '.') {
            inputDecimal();
            updateDisplay();
            return;
        }

        // Jika tidak ada kondisi di atas, berarti tombol angka
        inputDigit(value);
        updateDisplay();
    });
});