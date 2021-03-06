package com.fzu.dao;

import com.fzu.pojo.ClassExam;
import com.fzu.pojo.class_teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
@Repository
public class ClassDao {
    @Autowired
    JdbcTemplate jdbcTemplate;

    //增加班级_教师表(已完成)
    public void addClass(Map<String,String> map){
        //对map进行遍历
        for(Map.Entry<String, String> entry : map.entrySet()){
            String mapKey = entry.getKey();
            String mapValue = entry.getValue();
            String sql="insert into exam_system.class_teacher(class_name, teacher_id) values (?,?)";//id自增
            Object[] objects=new Object[2];
            objects[0]=mapKey;
            objects[1]=mapValue;
            System.out.println(mapKey);
            jdbcTemplate.update(sql,objects);
        }
    }

    //通过teacherId获取班级考试
    public List<ClassExam> getClassExamById(String teacherId){
        //从数据库中拿到的数据转化成跟ClassExam对应的
        List<ClassExam> result=new ArrayList<>();
        String sql="select * from exam_system.class_teacher where teacher_id = ? ";
        List<class_teacher> list = jdbcTemplate.query(sql,new BeanPropertyRowMapper<>(class_teacher.class),teacherId);
        System.out.println("List:"+list);
        System.out.println(teacherId);
        for(int i=0;i<list.size();i++){
            class_teacher obj=list.get(i);
            ClassExam cont=new ClassExam();
            cont.setClassId(obj.getClassId());
            cont.setClassName(obj.getClassName());
            if(obj.getClassStatus()!=null) cont.setClassStatus(obj.getClassStatus());
            if(obj.getStart_time()!=null && obj.getOver_time()!=null)cont.setExamTime(obj.getStart_time().toString()+" ~ "+obj.getOver_time().toString());
            result.add(cont);
        }
        System.out.println(result);
        return result;
    }
    //添加(更新)考试
    public void updateClassExam(ClassExam classExam) {
        //先转化然后逐个参数对应上传到数据库。
        String sql1 = "update exam_system.class_teacher set start_time = ?,over_time = ?,class_status = ? where class_id = ?";
        //String sql1 = "update exam_system.class_teacher set start_time = ? where class_id = ?";
        //String sql2 = "update exam_system.class_teacher set over_time = ? where class_id = ?";
        String time = classExam.getExamTime();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");
        //默认分两段
        if(time==null){
            time = "2020/08/05 00:00:00 ~ 2020/09/22 00:00:00";
        }
        String[] t = time.split("~");
        if(t.length<2){
            System.out.println("string.spilt结果小于2");
            return;
        }
        System.out.println(t[0]+" "+t[1]);

        Date d1 = null, d2 = null;
        try {
            d1 = sdf.parse(t[0]);
            d2 = sdf.parse(t[1]);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        Timestamp ts1 = new Timestamp(d1.getTime());
        System.out.println("ts1 = "+ts1.toString());
        Timestamp ts2 = new Timestamp(d2.getTime());
        System.out.println("ts2 = "+ts2.toString());

        int status = classExam.getClassStatus();
        int id = classExam.getClassId();
        Object[] params = new Object[]{ ts1,ts2,status,id};
        jdbcTemplate.update(sql1,params);
        //jdbcTemplate.update(sql1,ts1,classExam.getClassId());
        //jdbcTemplate.update(sql2,ts2,classExam.getClassId());
    }
    //通过班级id查询班级考试
    public ClassExam getClassExam(Integer classId){
        System.out.println(classId);
        String sql="select * from exam_system.class_teacher where class_id=?";
        class_teacher obj=jdbcTemplate.queryForObject(sql,new BeanPropertyRowMapper<>(class_teacher.class),new Object[]{classId});
        System.out.println(obj);
        ClassExam cont=new ClassExam();
        cont.setClassId(obj.getClassId());
        cont.setClassName(obj.getClassName());
        if(obj.getClassStatus()!=null) cont.setClassStatus(obj.getClassStatus());
        if(obj.getStart_time()!=null && obj.getOver_time()!=null)cont.setExamTime(obj.getStart_time().toString()+" ~ "+obj.getOver_time().toString());
        return cont;
    }
    //获得班级考试的开始时间(用于判断是否可以进入考试)
    public Date getStarttime(Integer classId){
        String sql="select class_teacher.start_time from class_teacher where class_id=?";
        return jdbcTemplate.queryForObject(sql,new Object[]{classId},Date.class);
    }
    //删除教室
    public void deleteClass(Integer classId){
        String sql = "delete from class_teacher where class_id = ?";
        String sel = "select class_name from class_teacher where class_id = ?";
        String classname = jdbcTemplate.queryForObject(sel,new Object[]{ classId},String.class);
        String sql2 = "delete from student where classroom = ?";
        int status1 = jdbcTemplate.update(sql,classId);
        int status2 = jdbcTemplate.update(sql2,classname);
        System.out.println("delete status1 = "+status1);
        System.out.println("delete status2 = "+status2);
    }

}
