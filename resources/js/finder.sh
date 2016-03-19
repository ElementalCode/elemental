#!/bin/bash
for file in *.js
do
	
	if [[ -z $(cat $file | grep '\$') ]]
	then
		echo NOT FOUND
	else
		echo $file
	fi
done
