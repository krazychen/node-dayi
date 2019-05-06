/*
 Navicat Premium Data Transfer

 Source Server         : localmysql
 Source Server Type    : MySQL
 Source Server Version : 80013
 Source Host           : localhost:3306
 Source Schema         : nodedayi

 Target Server Type    : MySQL
 Target Server Version : 80013
 File Encoding         : 65001

 Date: 06/05/2019 16:22:38
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for answer
-- ----------------------------
DROP TABLE IF EXISTS `answer`;
CREATE TABLE `answer` (
  `aid` int(11) NOT NULL AUTO_INCREMENT COMMENT '回复ID',
  `tid` int(11) NOT NULL COMMENT '主题ID',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `content` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '回复内容',
  `atime` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '回复时间',
  `afavor` int(11) DEFAULT '0' COMMENT '点赞',
  `parent_aid` int(11) DEFAULT NULL COMMENT '回复父ID',
  `isaccept` int(11) DEFAULT '0' COMMENT '采纳答案',
  `accepttime` timestamp NULL DEFAULT NULL COMMENT '采纳时间',
  PRIMARY KEY (`aid`) USING BTREE,
  KEY `pid` (`tid`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=20 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of answer
-- ----------------------------
BEGIN;
INSERT INTO `answer` VALUES (13, 30, 10018, '<p>3333</p>', '2019-05-06 10:26:20', 6, 30, 1, '2019-05-06 10:26:20');
INSERT INTO `answer` VALUES (14, 30, 10019, '<p>@laoshi:</p><p>3333</p><p><br></p><p>sdff</p>', '2019-05-06 10:37:54', 0, 30, 0, NULL);
INSERT INTO `answer` VALUES (15, 30, 10017, '<p>33fff</p>', '2019-05-06 10:37:55', 0, 30, 0, NULL);
INSERT INTO `answer` VALUES (16, 30, 10017, '<p>3333555tgg</p>', '2019-05-06 10:37:56', 0, 30, 0, NULL);
INSERT INTO `answer` VALUES (18, 30, 10017, '<p>&lt;-</p><p> @123rrtt:</p><p>3333555tgg</p><p> -&gt; </p><p><br></p><p>ffgg</p>', '2019-05-06 10:37:58', 0, 16, 0, NULL);
INSERT INTO `answer` VALUES (19, 33, 10018, '<p>12323</p>', '2019-05-06 11:54:36', 3, 33, 0, NULL);
COMMIT;

-- ----------------------------
-- Table structure for topic
-- ----------------------------
DROP TABLE IF EXISTS `topic`;
CREATE TABLE `topic` (
  `tid` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '标题',
  `publishtime` timestamp NOT NULL COMMENT '发布时间',
  `lasttime` timestamp NOT NULL COMMENT '最新更新时间',
  `uid` int(11) NOT NULL COMMENT '用户ID',
  `tclass` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '所在专栏',
  `tcontent` longtext CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '内容',
  `texperience` int(11) NOT NULL DEFAULT '0' COMMENT '悬赏积分',
  `status` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '帖子状态：未结、已结',
  `visits` int(11) DEFAULT '0' COMMENT '访问量',
  `replys` int(11) DEFAULT '0' COMMENT '回复量',
  `favors` int(11) DEFAULT '0' COMMENT '点赞量',
  `istop` int(11) DEFAULT NULL COMMENT '是否置顶',
  `topuid` int(11) DEFAULT NULL COMMENT '置顶人',
  `toptime` timestamp NULL DEFAULT NULL COMMENT '置顶时间',
  `isselect` int(11) DEFAULT NULL COMMENT '是否精华',
  `selectuid` int(11) DEFAULT NULL COMMENT '加精人',
  `selecttime` timestamp NULL DEFAULT NULL COMMENT '加精时间',
  PRIMARY KEY (`tid`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of topic
-- ----------------------------
BEGIN;
INSERT INTO `topic` VALUES (20, '123123', '2019-05-04 21:13:11', '2019-05-04 21:13:11', 10017, '提问', '<p>123123</p> ', 20, '未结', 4, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `topic` VALUES (21, '1111', '2019-05-04 21:14:38', '2019-05-04 21:14:38', 10017, '提问', '<p>11111</p> ', 20, '未结', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `topic` VALUES (34, 'ssss', '2019-05-06 14:33:30', '2019-05-06 14:33:30', 10018, '建议', '<p>sssss</p> ', 20, '未结', 3, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `topic` VALUES (24, '1223ttt', '2019-05-04 21:21:56', '2019-05-04 21:21:56', 10017, '分享', '<p>12323</p> ', 20, '未结', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `topic` VALUES (25, '1223ttt444', '2019-05-04 21:22:40', '2019-05-04 21:22:40', 10017, '分享', '<p>12323</p> ', 20, '未结', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `topic` VALUES (26, 'fg', '2019-05-04 21:23:13', '2019-05-04 21:23:13', 10017, '提问', '<p>12323</p> ', 20, '未结', 1, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `topic` VALUES (27, 'xxx', '2019-05-04 21:24:34', '2019-05-04 21:24:34', 10017, '分享', '<p>ss</p> ', 20, '未结', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `topic` VALUES (28, 'ggg', '2019-05-04 21:32:57', '2019-05-04 21:32:57', 10017, '公告', '<p>111</p> ', 20, '未结', 4, 0, 0, 1, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `topic` VALUES (29, 'sss', '2019-05-04 21:34:06', '2019-05-04 21:34:06', 10017, '动态', '<p>sss</p> ', 20, '未结', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `topic` VALUES (30, '323', '2019-05-04 21:44:03', '2019-05-04 21:44:03', 10017, '提问', '<p>21323</p> ', 20, '已结', 102, 7, 0, 1, NULL, NULL, 1, NULL, NULL);
INSERT INTO `topic` VALUES (31, '23123', '2019-05-04 21:45:35', '2019-05-04 21:45:35', 10017, '提问', '<p>fff</p> ', 20, '未结', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `topic` VALUES (32, 'hhh', '2019-05-04 21:46:29', '2019-05-04 21:46:29', 10017, '提问', '<p>hhhh</p> ', 20, '未结', 0, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `topic` VALUES (33, 'vvv', '2019-05-04 21:46:54', '2019-05-04 21:46:54', 10017, '提问', '<p>vvvv</p> ', 20, '未结', 21, 1, 0, 0, NULL, NULL, 0, NULL, NULL);
COMMIT;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `uid` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `mail` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '邮箱',
  `username` varchar(144) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `utime` timestamp NOT NULL COMMENT '注册时间',
  `sex` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '性别',
  `city` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '城市',
  `sign` longtext COMMENT '签名',
  `pic` longtext CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '头像',
  `role_type` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `experience` int(11) DEFAULT '0' COMMENT '积分',
  `checkintime` timestamp NULL DEFAULT NULL COMMENT '签到日期',
  PRIMARY KEY (`uid`,`mail`),
  KEY `uid` (`uid`)
) ENGINE=MyISAM AUTO_INCREMENT=10020 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (10017, '123@tt.com', '123rrtt', 'e10adc3949ba59abbe56e057f20f883e', '2019-04-30 17:02:11', '1', 'rrrt', 'ter', 'public/images/ue/8.jpg', '学生', 27, '2019-05-04 23:35:15');
INSERT INTO `user` VALUES (10018, '111@tt.com', 'laoshi', 'e10adc3949ba59abbe56e057f20f883e', '2019-05-03 22:47:59', '0', 'tsfggg', '', 'public/images/avatar/2.jpg', '老师', 0, NULL);
INSERT INTO `user` VALUES (10019, '222@tt.com', '222', 'e10adc3949ba59abbe56e057f20f883e', '2019-05-05 19:16:09', NULL, '中国', NULL, 'public/images/avatar/2.jpg', '学生', 0, NULL);
COMMIT;

-- ----------------------------
-- Table structure for user_exp_record
-- ----------------------------
DROP TABLE IF EXISTS `user_exp_record`;
CREATE TABLE `user_exp_record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL DEFAULT '0' COMMENT '用户id',
  `exp_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '积分类型',
  `exp_opt` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '积分操作',
  `exp_num` int(11) DEFAULT NULL COMMENT '积分数量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Records of user_exp_record
-- ----------------------------
BEGIN;
INSERT INTO `user_exp_record` VALUES (1, 10017, '增加', '签到', 5);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
