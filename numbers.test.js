const json = require('./data.json');

const input = process.env.input;

const result = getLiteralValueOfNumber(input);
console.log(input + ' => ' + result);


function getLiteralValueOfNumber(input) {
    if (input === '0') {
        return json.numbers["0"];
    }

    let map = extractReminders(input).map((number => {
        let amountOfZeros = (number.toString().match(/0/g) || []).length;
        console.log("here 2 ;;; " + amountOfZeros);

        if (amountOfZeros < 3) {
            console.log("here 3");

            return convertNumberToLiteralValue(number);
        } else if (amountOfZeros >= 3 && amountOfZeros < 6) {
            let result = number / Math.pow(10, 3);
            return convertNumberToLiteralValue(result, json.numbers.thousands);
        } else if (amountOfZeros >= 6 && amountOfZeros < 9) {
            let result = number / Math.pow(10, 6);
            return convertNumberToLiteralValue(result, json.numbers.millions);
        } else if (amountOfZeros >= 9 && amountOfZeros < 11) {
            let result = number / Math.pow(10, 9);
            return convertNumberToLiteralValue(result, json.numbers.billions);
        } else {
            throw new Error("Not supported!");
        }
    }))

    return map.join(' ');
}

function extractReminders(number, i = 1, j = 3) {
    let quotient;
    let dividend = number;
    let result = [];
    if (dividend === '0') {
        return result.push(dividend);
    } else {
        while (dividend > 0) {
            let divisor = (Math.pow(10, i * j));
            let reminder = dividend % divisor;
            result.unshift(reminder);

            quotient = (dividend - reminder) / divisor;
            dividend = quotient * divisor;

            i++
        }
    }
    return result;
}

function convertNumberToLiteralValue(number, path = json.numbers) {
    let numberAsString = number.toString();
    let length = numberAsString.length
    let whitespace = ' ';
    if (length === 1 || (length === 2 && numberAsString[0] === '1')) {
        return path.units[numberAsString];
    } else if (length === 2 && numberAsString[0] !== '1') {
        return (path.dozens[numberAsString[0]])
            .concat(whitespace)
            .concat(path.units[numberAsString[1]]);
    } else if (length === 3 && numberAsString[1] !== '1') {
        return (path.hundreds[numberAsString[0]])
            .concat(whitespace)
            .concat(path.dozens[numberAsString[1]])
            .concat(whitespace)
            .concat(path.units[numberAsString[2]]);
    } else if (length === 3 && numberAsString[1] === '1') {
        return (path.hundreds[numberAsString[0]])
            .concat(whitespace)
            .concat(path.units[numberAsString[1] + numberAsString[2]])
    }
}