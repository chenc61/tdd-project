const assert = require("assert");
const Money = require("./money");
const Portfolio = require("./portfolio");
const Bank = require("./bank");

class MoneyTest {
    setUp() {
        this.bank = new Bank();
        this.bank.addExchangeRate("EUR", "USD", 1.2);
        this.bank.addExchangeRate("USD", "KRW", 1100);
    }
    testMultiplication() {
        let tenEuros = new Money(10, "EUR");
        let twentyEuros = new Money(20, "EUR");
        assert.deepStrictEqual(tenEuros.times(2), twentyEuros);
    }
    testDivision() {
        let originalMoney = new Money(4002, "KRW");
        let actualMoneyAfterDivision = originalMoney.divide(4);
        let expectedMoneyAfterDivision = new Money(1000.5, "KRW");
        assert.deepStrictEqual(
            actualMoneyAfterDivision,
            expectedMoneyAfterDivision
        );
    }

    testAddition() {
        let fifteenDollars = new Money(15, "USD");
        let fiveDollars = new Money(5, "USD");
        let tenDollars = new Money(10, "USD");
        let portfolio = new Portfolio();
        portfolio.add(fiveDollars, tenDollars);
        assert.deepStrictEqual(portfolio.evaluate(new Bank(), "USD"), fifteenDollars);
    }

    testAdditionOfDollarsAndEuros() {
        let fiveDollars = new Money(5, "USD");
        let tenEuros = new Money(10, "EUR");
        let portfolio = new Portfolio();
        portfolio.add(fiveDollars, tenEuros);
        let expectedValue = new Money(17, "USD");
        assert.deepStrictEqual(portfolio.evaluate(this.bank, "USD"), expectedValue);
    }

    testAdditionOfDollarsAndWons() {
        let oneDollar = new Money(1, "USD");
        let elevenHundredWons = new Money(1100, "KRW");
        let portfolio = new Portfolio();
        portfolio.add(oneDollar, elevenHundredWons);
        let expectedValue = new Money(2200, "KRW");
        assert.deepStrictEqual(portfolio.evaluate(this.bank, "KRW"), expectedValue);
    }

    testAdditionWithMultipleMissingExchangeRates() {
        let oneDollar = new Money(1, "USD");
        let oneEuro = new Money(1, "EUR");
        let oneWon = new Money(1, "KRW");
        let portfolio = new Portfolio();
        let bank = new Bank();
        portfolio.add(oneDollar, oneEuro, oneWon);
        let expectedError = new Error("Missing exchange rate(s):[USD->Kalganid,EUR->Kalganid,KRW->Kalganid]");
        assert.throws(() => portfolio.evaluate(bank, "Kalganid"), expectedError);
    }

    testConversion() {
        let bank = new Bank();
        bank.addExchangeRate("EUR", "USD", 1.2)
        let tenEuros = new Money(10, "EUR");
        assert.deepStrictEqual(bank.convert(tenEuros, "USD"), new Money(12, "USD"));
    }

    testConversionWithMissingRate() {
        let bank = new Bank();
        let tenEuros = new Money(10, "EUR");
        let expectedValue = new Error("EUR->Kalganid");
        assert.throws(() =>
            bank.convert(tenEuros, "Kalganid")
            , expectedValue);
    }

    testConversion(){
        let tenEuros = new Money(10, "EUR");
        assert.deepStrictEqual(this.bank.convert(tenEuros, "USD"), new Money(12, "USD"));

        this.bank.addExchangeRate("EUR", "USD",1.3);
        assert.deepStrictEqual(this.bank.convert(tenEuros, "USD"), new Money(13, "USD"));
    }

    getAllTestMethods() {
        let moneyPrototype = MoneyTest.prototype;
        let allProps = Object.getOwnPropertyNames(moneyPrototype);
        let testMethods = allProps.filter((prop) => {
            return (
                typeof Reflect.get(moneyPrototype, prop) === "function" &&
                prop.startsWith("test")
            );
        });
        return testMethods;
    }

    runAllTests() {
        let testMethods = this.getAllTestMethods();
        testMethods.forEach((m) => {
            console.log("Running: %s()", m);
            let method = Reflect.get(this, m);
            try {
                this.setUp();
                Reflect.apply(method, this, []);
            } catch (e) {
                if (e instanceof assert.AssertionError) {
                    console.log(e);
                } else {
                    throw e;
                }
            }
        });
    }
}

new MoneyTest().runAllTests();
