#!/usr/bin/python

import os
import pandas as pd
import string
import itertools
import random
from collections import defaultdict 
from itertools import combinations
from faker import Faker


fake = Faker();

#for comb in range(2):
for comb in range(2000):
    fname = fake.first_name();
    lname = fake.last_name();
    name = "{} {}".format(fname,lname);
    username = "{}{}".format(fname,lname);
    email = "{}@{}.com".format(username,fake.domain_name());

    pwd = ''.join(random.choice(string.ascii_lowercase) for _ in range(6));
    token = ''.join(random.choice(string.ascii_lowercase + string.ascii_uppercase + string.digits) for _ in range(50));

    record = '"{}","{}","{}","{}","{}"'.format(name,username,email,pwd,token);
    print(record);

