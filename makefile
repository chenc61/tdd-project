py:
	python3 py/test_money.py

js:
	node js/test_money.js

go:
	cd go && go test -v -shuffle on ./... &&  cd ..

.PHONY: py js go