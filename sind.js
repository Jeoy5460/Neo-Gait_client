    var q0 = 1,q1 = 0,q2 = 0,q3 = 0; 
    var q0 = 1,q1 = 0,q2 = 0,q3 = 0;
    var exInt = 0, eyInt = 0, ezInt = 0;        // scaled integral error
    var pitch,roll,yaw;

    var roll_E = 0;
    var acc_nogravity=0;
    var Xa = 0,Xy = 0,Xz = 0;

function imu(data_a, data_g)
{   
    var Kp = 2.0 
    var Ki = 0.01
    var halfT = 0.0025  
    
    var gx = (data_g.x+1.45)/57.3;
    var gy = (data_g.y-0.45)/57.3;
    var gz = (data_g.z+0.3)/57.3;
    
    var ax = data_a.x;
    var ay = data_a.y;
    var az = data_a.z;
    
    norm = 1/sqrt(ax*ax + ay*ay + az*az);
    ax = ax * norm;
    ay = ay * norm;
    az = az * norm; 
    
    var vx = 2*(q1*q3 - q0*q2);
    var vy = 2*(q0*q1 + q2*q3);
    var vz = q0*q0 - q1*q1 - q2*q2 + q3*q3;
    
    acc_nogravity = sqrt(data_a.x*data_a.x+data_a.y*data_a.y+data_a.z*data_a.z);
    
    var ex = (ay*vz - az*vy);
    var ey = (az*vx - ax*vz);
    var ez = (ax*vy - ay*vx);
    
    exInt = exInt + ex*Ki;
    eyInt = eyInt + ey*Ki;
    ezInt = ezInt + ez*Ki;

    gx = gx+ Kp*ex + exInt;
    gy = gy + Kp*ey + eyInt;
    gz = gz + Kp*ez + ezInt;

    q0 = q0 + (-q1*gx - q2*gy - q3*gz)*halfT;
    q1 = q1 + (q0*gx + q2*gz - q3*gy)*halfT;
    q2 = q2 + (q0*gy - q1*gz + q3*gx)*halfT;
    q3 = q3 + (q0*gz + q1*gy - q2*gx)*halfT;

    // normalise quaternion             四元数规范化
    norm = sqrt(q0*q0 + q1*q1 + q2*q2 + q3*q3);
    q0 = q0 / norm;
    q1 = q1 / norm;
    q2 = q2 / norm;
    q3 = q3 / norm;

    //转换为欧拉角
    pitch  = asin(-2 * q1 * q3 + 2 * q0* q2)* 57.3;     // pitch
    roll   = atan2(2 * q2 * q3 + 2 * q0 * q1, -2 * q1 * q1 - 2 * q2* q2 + 1)* 57.3;     // roll
    yaw    = -atan2(2 * q1 * q2 + 2 * q0 * q3, -2 * q2*q2 - 2 * q3 * q3 + 1)* 57.3; // yaw 

}   

