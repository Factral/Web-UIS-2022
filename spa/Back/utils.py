import json

import re


def email_check(email):
    '''function for validating an Email'''
    # Make a regular expression
    # for validating an Email
    if not email:
        return False
    regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    # pass the regular expression
	# and the string into the fullmatch() method
    if(re.fullmatch(regex, email)):
        print("Valid Email")
        return True

    else:
        print("Invalid Email")
        return False

def is_json(myjson):
    '''function for validating an Email'''
    try:
        json.loads(myjson)
    except ValueError as e:
        return False
    return True
