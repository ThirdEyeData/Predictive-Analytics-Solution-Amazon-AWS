__author__ = 'abhinandan'

import csv
import subprocess
import threading
import tinys3
import psycopg2
import sys

def scheduler():
    resoucepath=str(sys.argv[1])
    #S3 Key
    accesskey=str(sys.argv[2]) 
    secretkey=str(sys.argv[3])
    bucketname=str(sys.argv[4])
    #Redshift 
    redshiftdbname=str(sys.argv[5])
    redshiftusername=str(sys.argv[6])
    redshiftpassword=str(sys.argv[7]) 
    redshifthost=str(sys.argv[8])  
    # do something here ...
    # call f() again in 60 seconds
    threading.Timer(300, scheduler).start()
    subprocess.check_call(['Rscript', resoucepath+'//Scripts//RScript//WeatherLR.R '+resoucepath], shell=False)
    #CSV Modification
    csvmofification(resoucepath)
    #Connect to S3
    s3fileuplaod(resoucepath,accesskey,secretkey,bucketname)
    #RedShift Connection
    redshiftUpload(redshiftdbname,redshiftusername,redshiftpassword,redshifthost)


#S3 File Upload
def s3fileuplaod(accesskey,secretkey,bucketname):
    s3 = tinys3.Connection(accesskey,secretkey,tls=True,endpoint='s3-us-west-2.amazonaws.com')
    f = open(resoucepath+'//Output//Prediction-new.csv','rb')
    s3.upload('Prediction-new.csv',f,bucketname)
    print("Uploaded")

#CSV modification
def csvmofification(resoucepath):
   with open(resoucepath+"//Output//prediction.csv", "rb") as infile, open(resoucepath+"//Output//Prediction-new.csv", "wb") as outfile:
     reader = csv.reader(infile)
     next(reader, None)  # skip the headers
     writer = csv.writer(outfile)
     begin = 1
     end = 14
     for row in reader:
         writer.writerow(row[begin:end])

#RedShift Connection
def redshiftUpload(redshiftdbname,redshiftusername,redshiftpassword,redshifthost,accesskey,secretkey,bucketname):
   conn_string = "dbname='"+redshiftdbname+"' port='5439' user='"+redshiftusername+"' password='"+redshiftpassword+"' host='"+redshifthost+"'";
   conn = psycopg2.connect(conn_string);

   truncatesql = conn.cursor();
   truncatesql.execute("truncate weather_prediction");
   conn.commit();
   truncatesql.close();

   loaddata = conn.cursor();
   loaddata.execute("copy weather_prediction from 's3://"+bucketname+"/Prediction-new.csv' credentials 'aws_access_key_id="+accesskey+";aws_secret_access_key="+secretkey+"' delimiter ',' region 'us-west-2'");
   conn.commit();
   loaddata.close();
   conn.close();
   print("done")


# start calling f now and every 5 mins thereafter
scheduler()