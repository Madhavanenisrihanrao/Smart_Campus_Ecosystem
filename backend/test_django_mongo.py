import os
os.environ['MONGODB_URI'] = 'mongodb+srv://yashwanthpuligila548:5485654@cluster1.p9g3qdo.mongodb.net/?appName=Cluster1'

from core.mongodb import client, db

if client:
    print('✅ Django MongoDB connected!')
    print(f'📊 Database: {db.name}')
    print(f'📁 Collections: {db.list_collection_names()}')
else:
    print('❌ Connection failed')
