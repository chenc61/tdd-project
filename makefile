py:
	python3 py/test_money.py

js:
	node js/test_money.js

go:
	go test -v go/money_test.go

.PHONY: py js go