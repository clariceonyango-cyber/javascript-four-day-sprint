// ==========================================
// DAY 1: JAVASCRIPT PRACTICAL EXERCISES
// ==========================================

// 1. VALUES, DATA TYPES AND VARIABLES

const itemName = "Notebook";
const price = 12.5;
const quantity = 3;
let customerName = "Clarice";

console.log("Item:", itemName);
console.log("Price:", price);
console.log("Quantity:", quantity);
console.log("Customer:", customerName);

console.log(typeof itemName); // string
console.log(typeof price); // number
console.log(typeof true); // boolean
console.log(typeof undefined); // undefined
console.log(typeof null); // object (JavaScript behaviour)

customerName = "Student";
console.log("Updated customer:", customerName);


// 2. OPERATORS AND RECEIPT CALCULATION

const subtotal = price * quantity;
const tax = subtotal * 0.08;
const total = subtotal + tax;

console.log("Subtotal:", subtotal);
console.log("Tax:", tax);
console.log("Total:", total.toFixed(2));

// Expected total: 40.50


// 3. CONVERTING TEXT INTO NUMBERS

const priceText = "25";
const convertedPrice = Number(priceText);

if (Number.isFinite(convertedPrice)) {
    console.log("Converted price:", convertedPrice);
} else {
    console.log("Invalid price");
}


// 4. REQUIRED CHALLENGE 1: MINUTES TO HOURS

function convertMinutes(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return {
        hours: hours,
        minutes: remainingMinutes
    };
}

const time = convertMinutes(137);

console.log(
    "Time:",
    time.hours,
    "hours and",
    time.minutes,
    "minutes"
);

// Expected: 2 hours and 17 minutes.


// 5. CONDITIONS: DISCOUNT CALCULATION

function getDiscountedTotal(total, member) {
    if (!Number.isFinite(total) || total < 0) {
        return null;
    }

    if (member && total >= 50) {
        return total * 0.9;
    }

    return total;
}

console.log(getDiscountedTotal(50, true));  // 45
console.log(getDiscountedTotal(80, false)); // 80
console.log(getDiscountedTotal(-5, true));  // null


// 6. REQUIRED CHALLENGE 2: GRADE LABELS

function gradeLabel(score) {
    if (!Number.isFinite(score) || score < 0 || score > 100) {
        return "Invalid";
    }

    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";

    return "F";
}

console.log(gradeLabel(89));  // B
console.log(gradeLabel(90));  // A
console.log(gradeLabel(0));   // F
console.log(gradeLabel(100)); // A
console.log(gradeLabel(-1));  // Invalid
console.log(gradeLabel(101)); // Invalid


// 7. LOOPS AND ACCUMULATION

const prices = [5, 12, 25, 8, 30];

let totalPrice = 0;
let pricesAboveTwenty = 0;

for (const currentPrice of prices) {
    totalPrice += currentPrice;

    if (currentPrice > 20) {
        pricesAboveTwenty++;
    }
}

console.log("Total price:", totalPrice);
console.log("Prices above 20:", pricesAboveTwenty);

// Expected total: 80
// Expected count above 20: 2

// Check for an empty array.
const emptyPrices = [];

if (emptyPrices.length === 0) {
    console.log("There are no prices to calculate.");
}


// 8. REQUIRED CHALLENGE 3: FIZZBUZZ

function fizzBuzz(limit) {
    const results = [];

    for (let number = 1; number <= limit; number++) {

        if (number % 3 === 0 && number % 5 === 0) {
            results.push("FizzBuzz");
        } else if (number % 3 === 0) {
            results.push("Fizz");
        } else if (number % 5 === 0) {
            results.push("Buzz");
        } else {
            results.push(number);
        }
    }

    return results;
}

console.log(fizzBuzz(15));
console.log(fizzBuzz(16));

// The combined condition comes first because numbers
// divisible by both 3 and 5 must be labelled FizzBuzz.


// 9. REUSABLE RECEIPT FUNCTIONS

function calculateLineTotal(price, quantity) {
    if (
        !Number.isFinite(price) ||
        !Number.isInteger(quantity) ||
        price < 0 ||
        quantity < 0
    ) {
        throw new Error(
            "Price and quantity must be valid non-negative numbers."
        );
    }

    return price * quantity;
}

function calculateTax(amount, taxRate = 0.08) {
    if (
        !Number.isFinite(amount) ||
        !Number.isFinite(taxRate) ||
        amount < 0 ||
        taxRate < 0
    ) {
        throw new Error("Invalid amount or tax rate.");
    }

    return amount * taxRate;
}

function formatMoney(amount) {
    return "$" + amount.toFixed(2);
}

function printReceipt(items) {
    let receiptSubtotal = 0;

    for (const item of items) {
        const lineTotal = calculateLineTotal(
            item.price,
            item.quantity
        );

        receiptSubtotal += lineTotal;

        console.log(
            item.name + ": " + formatMoney(lineTotal)
        );
    }

    const receiptTax = calculateTax(receiptSubtotal);
    const finalTotal = receiptSubtotal + receiptTax;

    console.log("Subtotal:", formatMoney(receiptSubtotal));
    console.log("Tax:", formatMoney(receiptTax));
    console.log("Final total:", formatMoney(finalTotal));

    return {
        subtotal: receiptSubtotal,
        tax: receiptTax,
        total: finalTotal
    };
}

const shoppingItems = [
    { name: "Notebook", price: 12.5, quantity: 3 },
    { name: "Pen", price: 2, quantity: 2 }
];

printReceipt(shoppingItems);


// 10. REQUIRED CHALLENGE 4: DISCOUNTED CART TAX

function calculateDiscountedCart(items, taxRate = 0.08) {
    let discountedSubtotal = 0;

    for (const item of items) {
        const lineTotal = calculateLineTotal(
            item.price,
            item.quantity
        );

        let discountedLineTotal = lineTotal;

        // Quantities above 5 receive 5% off that line.
        if (item.quantity > 5) {
            discountedLineTotal = lineTotal * 0.95;
        }

        discountedSubtotal += discountedLineTotal;
    }

    // Tax is calculated AFTER line discounts.
    const cartTax = calculateTax(discountedSubtotal, taxRate);
    const finalTotal = discountedSubtotal + cartTax;

    return {
        subtotalBeforeTax: discountedSubtotal,
        tax: cartTax,
        total: finalTotal
    };
}

const discountedItems = [
    { name: "Books", price: 10, quantity: 6 },
    { name: "Pens", price: 5, quantity: 2 }
];

const discountedResult = calculateDiscountedCart(discountedItems);

console.log("Discounted subtotal:", formatMoney(discountedResult.subtotalBeforeTax));
console.log("Tax:", formatMoney(discountedResult.tax));
console.log("Final total:", formatMoney(discountedResult.total));

// Expected:
// Books: 6 x $10 = $60 less 5% = $57
// Pens: 2 x $5 = $10
// Discounted subtotal = $67
// Tax at 8% = $5.36
// Final total = $72.36


// 11. MANUAL TESTS

function runTest(description, actual, expected) {
    const passed = Object.is(actual, expected);

    console.log(
        (passed ? "PASS: " : "FAIL: ") + description,
        "| Expected:",
        expected,
        "| Actual:",
        actual
    );
}

runTest("Normal line total", calculateLineTotal(10, 2), 20);
runTest("Zero quantity", calculateLineTotal(10, 0), 0);
runTest("Decimal price", calculateLineTotal(2.5, 2), 5);
runTest("Member discount", getDiscountedTotal(50, true), 45);
runTest("Non-member price", getDiscountedTotal(80, false), 80);
runTest("Grade boundary", gradeLabel(90), "A");

// Invalid input test.
try {
    calculateLineTotal(-10, 2);
    console.log("FAIL: Negative price should be rejected.");
} catch (error) {
    console.log("PASS: Negative price was rejected.");
}
