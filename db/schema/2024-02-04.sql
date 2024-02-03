PGDMP                          |            kioskregistrardb    15.4    15.4 [    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16398    kioskregistrardb    DATABASE     �   CREATE DATABASE kioskregistrardb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
     DROP DATABASE kioskregistrardb;
                postgres    false                        2615    16399    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            �            1255    16400    usp_reset() 	   PROCEDURE     v	  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

	DELETE FROM dbo."Courses";
	DELETE FROM dbo."UserOneSignalSubscription";
	DELETE FROM dbo."SubmittedRequirements";
	DELETE FROM dbo."Notifications";
	DELETE FROM dbo."Request";
	DELETE FROM dbo."RequestRequirements";
	DELETE FROM dbo."RequestType";
	DELETE FROM dbo."Admin";
	DELETE FROM dbo."Member";
	DELETE FROM dbo."Users";
	DELETE FROM dbo."Files";
	
	ALTER SEQUENCE dbo."SubmittedRequirements_SubmittedRequirementId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Notifications_NotificationId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Admin_AdminId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Member_MemberId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Users_UserId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Request_RequestId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."RequestRequirements_RequestRequirementsId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."RequestType_RequestTypeId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Files_FileId_seq" RESTART WITH 1;
	
	INSERT INTO dbo."Users" (
		"UserCode", 
		"UserName", 
		"Password", 
		"UserType",
		"AccessGranted",
		"Access")
	VALUES (
			'000001',
			'admin',
			'$2b$10$LqN3kzfgaYnP5PfDZFfT4edUFqh5Lu7amIxeDDDmu/KEqQFze.p8a',  
			'ADMIN',
			true,
			'[
      {
        "page": "Dashboard",
        "view": true,
        "modify": true,
        "rights": [
          "Request",
          "Support"
        ]
      },
      {
        "page": "Admin access",
        "view": true,
        "modify": true,
        "rights": [
          "Access",
          "Rights"
        ]
      },
      {
        "page": "Members",
        "view": true,
        "modify": true,
        "rights": []
      },
      {
        "page": "Request Type",
        "view": true,
        "modify": true,
        "rights": [
          "Requirements"
        ]
      },
      {
        "page": "Courses",
        "view": true,
        "modify": true
      },
      {
        "page": "Request Management",
        "view": true,
        "modify": true,
        "rights": [
          "Assign"
        ]
      },
      {
        "page": "Support Management",
        "view": true,
        "modify": true,
        "rights": [
          "Approval"
        ]
      }
    ]');
	
	INSERT INTO dbo."Admin" (
		"UserId", 
		"AdminCode",
		"FullName",
		"MobileNumber")
	VALUES (
			1,
			'000001',
			'Admin Admin',
			'123456');
	
END;
$_$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    6            �            1259    16408    Admin    TABLE     �   CREATE TABLE dbo."Admin" (
    "AdminId" bigint NOT NULL,
    "UserId" bigint NOT NULL,
    "FullName" character varying NOT NULL,
    "MobileNumber" character varying NOT NULL,
    "AdminCode" character varying DEFAULT ''::character varying NOT NULL
);
    DROP TABLE dbo."Admin";
       dbo         heap    postgres    false    6            �            1259    16414    Admin_AdminId_seq    SEQUENCE     �   ALTER TABLE dbo."Admin" ALTER COLUMN "AdminId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Admin_AdminId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    215            �            1259    82041    Courses    TABLE     l   CREATE TABLE dbo."Courses" (
    "CourseId" bigint NOT NULL,
    "CourseName" character varying NOT NULL
);
    DROP TABLE dbo."Courses";
       dbo         heap    postgres    false    6            �            1259    82048    Courses_CourseId_seq    SEQUENCE     �   ALTER TABLE dbo."Courses" ALTER COLUMN "CourseId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Courses_CourseId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    239            �            1259    16415    Files    TABLE        CREATE TABLE dbo."Files" (
    "FileId" bigint NOT NULL,
    "Name" text NOT NULL,
    "Url" text,
    "GUID" text NOT NULL
);
    DROP TABLE dbo."Files";
       dbo         heap    postgres    false    6            �            1259    16420    Files_FileId_seq    SEQUENCE     �   ALTER TABLE dbo."Files" ALTER COLUMN "FileId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Files_FileId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    217            �            1259    16421    Member    TABLE     ?  CREATE TABLE dbo."Member" (
    "MemberId" bigint NOT NULL,
    "UserId" bigint NOT NULL,
    "FullName" character varying NOT NULL,
    "Email" character varying,
    "MobileNumber" character varying NOT NULL,
    "BirthDate" date NOT NULL,
    "Address" character varying,
    "Gender" character varying NOT NULL,
    "CourseTaken" character varying NOT NULL,
    "Major" character varying,
    "IsAlumni" boolean DEFAULT false NOT NULL,
    "SchoolYearLastAttended" character varying NOT NULL,
    "PrimarySchoolName" character varying,
    "PrimarySYGraduated" character varying,
    "SecondarySchoolName" character varying,
    "SecondarySYGraduated" character varying,
    "BirthCertFileId" bigint,
    "IsVerified" boolean DEFAULT false NOT NULL,
    "MemberCode" character varying DEFAULT ''::character varying NOT NULL
);
    DROP TABLE dbo."Member";
       dbo         heap    postgres    false    6            �            1259    16428    Member_MemberId_seq    SEQUENCE     �   ALTER TABLE dbo."Member" ALTER COLUMN "MemberId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Member_MemberId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    219            �            1259    81857    Notifications    TABLE     �  CREATE TABLE dbo."Notifications" (
    "NotificationId" bigint NOT NULL,
    "Title" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "Type" character varying NOT NULL,
    "ReferenceId" character varying NOT NULL,
    "IsRead" boolean DEFAULT false NOT NULL,
    "UserId" bigint NOT NULL,
    "Date" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL
);
     DROP TABLE dbo."Notifications";
       dbo         heap    postgres    false    6            �            1259    81856     Notifications_NotificationId_seq    SEQUENCE     �   ALTER TABLE dbo."Notifications" ALTER COLUMN "NotificationId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Notifications_NotificationId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    231            �            1259    16429    Request    TABLE       CREATE TABLE dbo."Request" (
    "RequestId" bigint NOT NULL,
    "RequestedById" bigint NOT NULL,
    "RequestTypeId" bigint NOT NULL,
    "DateRequested" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "AssignedAdminId" bigint,
    "DateAssigned" timestamp with time zone,
    "DatePaid" timestamp with time zone,
    "DateProcessStarted" timestamp with time zone,
    "DateProcessEnd" timestamp with time zone,
    "DateCompleted" timestamp with time zone,
    "DateClosed" timestamp with time zone,
    "DateLastUpdated" timestamp with time zone,
    "RequestStatus" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "Description" character varying NOT NULL,
    "RequestNo" character varying DEFAULT ''::character varying NOT NULL,
    "IsPaid" boolean DEFAULT false,
    "IsReAssigned" boolean DEFAULT false,
    "ReAssignedAdminId" bigint,
    "RAssignedDate" timestamp with time zone,
    "RejectReason" character varying,
    "CancelReason" character varying
);
    DROP TABLE dbo."Request";
       dbo         heap    postgres    false    6            �            1259    16436    RequestRequirements    TABLE       CREATE TABLE dbo."RequestRequirements" (
    "RequestRequirementsId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "RequestTypeId" bigint NOT NULL,
    "RequireToSubmitProof" boolean DEFAULT false NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
 &   DROP TABLE dbo."RequestRequirements";
       dbo         heap    postgres    false    6            �            1259    16443 -   RequestRequirements_RequestRequirementsId_seq    SEQUENCE       ALTER TABLE dbo."RequestRequirements" ALTER COLUMN "RequestRequirementsId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."RequestRequirements_RequestRequirementsId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    222    6            �            1259    16444    RequestType    TABLE     .  CREATE TABLE dbo."RequestType" (
    "RequestTypeId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "AuthorizeACopy" boolean DEFAULT false NOT NULL,
    "Fee" numeric DEFAULT 0 NOT NULL,
    "IsPaymentRequired" boolean DEFAULT false NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."RequestType";
       dbo         heap    postgres    false    6            �            1259    16453    RequestType_RequestTypeId_seq    SEQUENCE     �   ALTER TABLE dbo."RequestType" ALTER COLUMN "RequestTypeId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."RequestType_RequestTypeId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    224            �            1259    16454    Request_RequestId_seq    SEQUENCE     �   ALTER TABLE dbo."Request" ALTER COLUMN "RequestId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Request_RequestId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    221            �            1259    81925    SubmittedRequirements    TABLE     �   CREATE TABLE dbo."SubmittedRequirements" (
    "SubmittedRequirementId" bigint NOT NULL,
    "RequestId" bigint NOT NULL,
    "RequestRequirementsId" bigint NOT NULL,
    "Files" json DEFAULT '[]'::json NOT NULL
);
 (   DROP TABLE dbo."SubmittedRequirements";
       dbo         heap    postgres    false    6            �            1259    81924 0   SubmittedRequirements_SubmittedRequirementId_seq    SEQUENCE       ALTER TABLE dbo."SubmittedRequirements" ALTER COLUMN "SubmittedRequirementId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."SubmittedRequirements_SubmittedRequirementId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    233            �            1259    82013    SupportTicketConvo    TABLE       CREATE TABLE dbo."SupportTicketConvo" (
    "SupportTicketConvoId" bigint NOT NULL,
    "SupportTicketId" bigint NOT NULL,
    "FromUserId" bigint NOT NULL,
    "Message" character varying NOT NULL,
    "Date" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "Read" boolean DEFAULT false NOT NULL
);
 %   DROP TABLE dbo."SupportTicketConvo";
       dbo         heap    postgres    false    6            �            1259    82033 +   SupportTicketConvo_SupportTicketConvoId_seq    SEQUENCE       ALTER TABLE dbo."SupportTicketConvo" ALTER COLUMN "SupportTicketConvoId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."SupportTicketConvo_SupportTicketConvoId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    237            �            1259    81974    SupportTickets    TABLE     �  CREATE TABLE dbo."SupportTickets" (
    "SupportTicketId" bigint NOT NULL,
    "Title" character varying NOT NULL,
    "Description" character varying NOT NULL,
    "Date" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "Status" character varying DEFAULT 'OPEN'::character varying NOT NULL,
    "AssignedAdminId" bigint NOT NULL,
    "RequestedByMemberId" bigint NOT NULL
);
 !   DROP TABLE dbo."SupportTickets";
       dbo         heap    postgres    false    6            �            1259    81973 "   SupportTickets_SupportTicketId_seq    SEQUENCE     �   ALTER TABLE dbo."SupportTickets" ALTER COLUMN "SupportTicketId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."SupportTickets_SupportTicketId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    236            �            1259    16455    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    6            �            1259    81952    UserOneSignalSubscription    TABLE     �   CREATE TABLE dbo."UserOneSignalSubscription" (
    "UserId" bigint NOT NULL,
    "SubscriptionID" character varying NOT NULL
);
 ,   DROP TABLE dbo."UserOneSignalSubscription";
       dbo         heap    postgres    false    6            �            1259    16460    Users    TABLE     �  CREATE TABLE dbo."Users" (
    "UserId" bigint NOT NULL,
    "UserName" character varying NOT NULL,
    "Password" character varying NOT NULL,
    "UserType" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "ProfileFileId" bigint,
    "AccessGranted" boolean DEFAULT false NOT NULL,
    "Access" json DEFAULT '[]'::json NOT NULL,
    "UserCode" character varying
);
    DROP TABLE dbo."Users";
       dbo         heap    postgres    false    6            �            1259    16468    Users_UserId_seq    SEQUENCE     �   ALTER TABLE dbo."Users" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    228            }          0    16408    Admin 
   TABLE DATA           \   COPY dbo."Admin" ("AdminId", "UserId", "FullName", "MobileNumber", "AdminCode") FROM stdin;
    dbo          postgres    false    215   ��       �          0    82041    Courses 
   TABLE DATA           :   COPY dbo."Courses" ("CourseId", "CourseName") FROM stdin;
    dbo          postgres    false    239   %�                 0    16415    Files 
   TABLE DATA           ?   COPY dbo."Files" ("FileId", "Name", "Url", "GUID") FROM stdin;
    dbo          postgres    false    217   B�       �          0    16421    Member 
   TABLE DATA           C  COPY dbo."Member" ("MemberId", "UserId", "FullName", "Email", "MobileNumber", "BirthDate", "Address", "Gender", "CourseTaken", "Major", "IsAlumni", "SchoolYearLastAttended", "PrimarySchoolName", "PrimarySYGraduated", "SecondarySchoolName", "SecondarySYGraduated", "BirthCertFileId", "IsVerified", "MemberCode") FROM stdin;
    dbo          postgres    false    219   _�       �          0    81857    Notifications 
   TABLE DATA           �   COPY dbo."Notifications" ("NotificationId", "Title", "Description", "Type", "ReferenceId", "IsRead", "UserId", "Date") FROM stdin;
    dbo          postgres    false    231   |�       �          0    16429    Request 
   TABLE DATA           v  COPY dbo."Request" ("RequestId", "RequestedById", "RequestTypeId", "DateRequested", "AssignedAdminId", "DateAssigned", "DatePaid", "DateProcessStarted", "DateProcessEnd", "DateCompleted", "DateClosed", "DateLastUpdated", "RequestStatus", "Description", "RequestNo", "IsPaid", "IsReAssigned", "ReAssignedAdminId", "RAssignedDate", "RejectReason", "CancelReason") FROM stdin;
    dbo          postgres    false    221   ��       �          0    16436    RequestRequirements 
   TABLE DATA           �   COPY dbo."RequestRequirements" ("RequestRequirementsId", "Name", "RequestTypeId", "RequireToSubmitProof", "Active") FROM stdin;
    dbo          postgres    false    222   ��       �          0    16444    RequestType 
   TABLE DATA           u   COPY dbo."RequestType" ("RequestTypeId", "Name", "AuthorizeACopy", "Fee", "IsPaymentRequired", "Active") FROM stdin;
    dbo          postgres    false    224   Ӊ       �          0    81925    SubmittedRequirements 
   TABLE DATA           w   COPY dbo."SubmittedRequirements" ("SubmittedRequirementId", "RequestId", "RequestRequirementsId", "Files") FROM stdin;
    dbo          postgres    false    233   ��       �          0    82013    SupportTicketConvo 
   TABLE DATA           �   COPY dbo."SupportTicketConvo" ("SupportTicketConvoId", "SupportTicketId", "FromUserId", "Message", "Date", "Active", "Read") FROM stdin;
    dbo          postgres    false    237   �       �          0    81974    SupportTickets 
   TABLE DATA           �   COPY dbo."SupportTickets" ("SupportTicketId", "Title", "Description", "Date", "Status", "AssignedAdminId", "RequestedByMemberId") FROM stdin;
    dbo          postgres    false    236   *�       �          0    16455    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    227   G�       �          0    81952    UserOneSignalSubscription 
   TABLE DATA           N   COPY dbo."UserOneSignalSubscription" ("UserId", "SubscriptionID") FROM stdin;
    dbo          postgres    false    234   d�       �          0    16460    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "UserName", "Password", "UserType", "Active", "ProfileFileId", "AccessGranted", "Access", "UserCode") FROM stdin;
    dbo          postgres    false    228   ��       �           0    0    Admin_AdminId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Admin_AdminId_seq"', 1, true);
          dbo          postgres    false    216            �           0    0    Courses_CourseId_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('dbo."Courses_CourseId_seq"', 2, true);
          dbo          postgres    false    240            �           0    0    Files_FileId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Files_FileId_seq"', 1, false);
          dbo          postgres    false    218            �           0    0    Member_MemberId_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('dbo."Member_MemberId_seq"', 1, false);
          dbo          postgres    false    220            �           0    0     Notifications_NotificationId_seq    SEQUENCE SET     N   SELECT pg_catalog.setval('dbo."Notifications_NotificationId_seq"', 1, false);
          dbo          postgres    false    230            �           0    0 -   RequestRequirements_RequestRequirementsId_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('dbo."RequestRequirements_RequestRequirementsId_seq"', 1, false);
          dbo          postgres    false    223            �           0    0    RequestType_RequestTypeId_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('dbo."RequestType_RequestTypeId_seq"', 1, false);
          dbo          postgres    false    225            �           0    0    Request_RequestId_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('dbo."Request_RequestId_seq"', 1, false);
          dbo          postgres    false    226            �           0    0 0   SubmittedRequirements_SubmittedRequirementId_seq    SEQUENCE SET     ^   SELECT pg_catalog.setval('dbo."SubmittedRequirements_SubmittedRequirementId_seq"', 1, false);
          dbo          postgres    false    232            �           0    0 +   SupportTicketConvo_SupportTicketConvoId_seq    SEQUENCE SET     Y   SELECT pg_catalog.setval('dbo."SupportTicketConvo_SupportTicketConvoId_seq"', 1, false);
          dbo          postgres    false    238            �           0    0 "   SupportTickets_SupportTicketId_seq    SEQUENCE SET     P   SELECT pg_catalog.setval('dbo."SupportTickets_SupportTicketId_seq"', 1, false);
          dbo          postgres    false    235            �           0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 1, true);
          dbo          postgres    false    229            �           2606    16472    Admin Admin_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY dbo."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("AdminId");
 ;   ALTER TABLE ONLY dbo."Admin" DROP CONSTRAINT "Admin_pkey";
       dbo            postgres    false    215            �           2606    82047    Courses Courses_pkey 
   CONSTRAINT     [   ALTER TABLE ONLY dbo."Courses"
    ADD CONSTRAINT "Courses_pkey" PRIMARY KEY ("CourseId");
 ?   ALTER TABLE ONLY dbo."Courses" DROP CONSTRAINT "Courses_pkey";
       dbo            postgres    false    239            �           2606    16474    Member Member_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Member"
    ADD CONSTRAINT "Member_pkey" PRIMARY KEY ("MemberId");
 =   ALTER TABLE ONLY dbo."Member" DROP CONSTRAINT "Member_pkey";
       dbo            postgres    false    219            �           2606    81865     Notifications Notifications_pkey 
   CONSTRAINT     m   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT "Notifications_pkey" PRIMARY KEY ("NotificationId");
 K   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT "Notifications_pkey";
       dbo            postgres    false    231            �           2606    16476 ,   RequestRequirements RequestRequirements_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."RequestRequirements"
    ADD CONSTRAINT "RequestRequirements_pkey" PRIMARY KEY ("RequestRequirementsId");
 W   ALTER TABLE ONLY dbo."RequestRequirements" DROP CONSTRAINT "RequestRequirements_pkey";
       dbo            postgres    false    222            �           2606    16478    RequestType RequestType_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY dbo."RequestType"
    ADD CONSTRAINT "RequestType_pkey" PRIMARY KEY ("RequestTypeId");
 G   ALTER TABLE ONLY dbo."RequestType" DROP CONSTRAINT "RequestType_pkey";
       dbo            postgres    false    224            �           2606    16480    Request Request_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Request"
    ADD CONSTRAINT "Request_pkey" PRIMARY KEY ("RequestId");
 ?   ALTER TABLE ONLY dbo."Request" DROP CONSTRAINT "Request_pkey";
       dbo            postgres    false    221            �           2606    81932 0   SubmittedRequirements SubmittedRequirements_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."SubmittedRequirements"
    ADD CONSTRAINT "SubmittedRequirements_pkey" PRIMARY KEY ("SubmittedRequirementId");
 [   ALTER TABLE ONLY dbo."SubmittedRequirements" DROP CONSTRAINT "SubmittedRequirements_pkey";
       dbo            postgres    false    233            �           2606    82022 *   SupportTicketConvo SupportTicketConvo_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY dbo."SupportTicketConvo"
    ADD CONSTRAINT "SupportTicketConvo_pkey" PRIMARY KEY ("SupportTicketConvoId");
 U   ALTER TABLE ONLY dbo."SupportTicketConvo" DROP CONSTRAINT "SupportTicketConvo_pkey";
       dbo            postgres    false    237            �           2606    81982 "   SupportTickets SupportTickets_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY dbo."SupportTickets"
    ADD CONSTRAINT "SupportTickets_pkey" PRIMARY KEY ("SupportTicketId");
 M   ALTER TABLE ONLY dbo."SupportTickets" DROP CONSTRAINT "SupportTickets_pkey";
       dbo            postgres    false    236            �           2606    16482    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    227            �           2606    81958 8   UserOneSignalSubscription UserOneSignalSubscription_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."UserOneSignalSubscription"
    ADD CONSTRAINT "UserOneSignalSubscription_pkey" PRIMARY KEY ("UserId", "SubscriptionID");
 c   ALTER TABLE ONLY dbo."UserOneSignalSubscription" DROP CONSTRAINT "UserOneSignalSubscription_pkey";
       dbo            postgres    false    234    234            �           2606    16484    Files pk_files_901578250 
   CONSTRAINT     [   ALTER TABLE ONLY dbo."Files"
    ADD CONSTRAINT pk_files_901578250 PRIMARY KEY ("FileId");
 A   ALTER TABLE ONLY dbo."Files" DROP CONSTRAINT pk_files_901578250;
       dbo            postgres    false    217            �           2606    16486    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    228            �           1259    16488    u_requestRequirement    INDEX     �   CREATE UNIQUE INDEX "u_requestRequirement" ON dbo."RequestRequirements" USING btree ("Name", "RequestTypeId", "Active") WITH (deduplicate_items='true') WHERE ("Active" = true);
 '   DROP INDEX dbo."u_requestRequirement";
       dbo            postgres    false    222    222    222    222            �           1259    16489    u_requestType    INDEX     �   CREATE UNIQUE INDEX "u_requestType" ON dbo."RequestType" USING btree ("Name", "Active") WITH (deduplicate_items='true') WHERE ("Active" = true);
     DROP INDEX dbo."u_requestType";
       dbo            postgres    false    224    224    224            �           1259    16490    u_user    INDEX     f   CREATE UNIQUE INDEX u_user ON dbo."Users" USING btree ("UserName", "Active") WHERE ("Active" = true);
    DROP INDEX dbo.u_user;
       dbo            postgres    false    228    228    228            �           2606    16491    Admin fk_Admin_User    FK CONSTRAINT     y   ALTER TABLE ONLY dbo."Admin"
    ADD CONSTRAINT "fk_Admin_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 >   ALTER TABLE ONLY dbo."Admin" DROP CONSTRAINT "fk_Admin_User";
       dbo          postgres    false    3281    215    228            �           2606    16496     Member fk_Member_BirthCertFileId    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Member"
    ADD CONSTRAINT "fk_Member_BirthCertFileId" FOREIGN KEY ("BirthCertFileId") REFERENCES dbo."Files"("FileId");
 K   ALTER TABLE ONLY dbo."Member" DROP CONSTRAINT "fk_Member_BirthCertFileId";
       dbo          postgres    false    3267    219    217            �           2606    16501    Member fk_Member_User    FK CONSTRAINT     {   ALTER TABLE ONLY dbo."Member"
    ADD CONSTRAINT "fk_Member_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 @   ALTER TABLE ONLY dbo."Member" DROP CONSTRAINT "fk_Member_User";
       dbo          postgres    false    228    3281    219            �           2606    81933 6   SubmittedRequirements fk_SubmittedRequirements_Request    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SubmittedRequirements"
    ADD CONSTRAINT "fk_SubmittedRequirements_Request" FOREIGN KEY ("RequestId") REFERENCES dbo."Request"("RequestId");
 a   ALTER TABLE ONLY dbo."SubmittedRequirements" DROP CONSTRAINT "fk_SubmittedRequirements_Request";
       dbo          postgres    false    233    221    3271            �           2606    81938 ;   SubmittedRequirements fk_SubmittedRequirements_Requirements    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SubmittedRequirements"
    ADD CONSTRAINT "fk_SubmittedRequirements_Requirements" FOREIGN KEY ("RequestRequirementsId") REFERENCES dbo."RequestRequirements"("RequestRequirementsId");
 f   ALTER TABLE ONLY dbo."SubmittedRequirements" DROP CONSTRAINT "fk_SubmittedRequirements_Requirements";
       dbo          postgres    false    3273    233    222            �           2606    81959 ;   UserOneSignalSubscription fk_UserOneSignalSubscription_User    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."UserOneSignalSubscription"
    ADD CONSTRAINT "fk_UserOneSignalSubscription_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 f   ALTER TABLE ONLY dbo."UserOneSignalSubscription" DROP CONSTRAINT "fk_UserOneSignalSubscription_User";
       dbo          postgres    false    228    234    3281            �           2606    16506    Users fk_Users_File    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT "fk_Users_File" FOREIGN KEY ("ProfileFileId") REFERENCES dbo."Files"("FileId") NOT VALID;
 >   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT "fk_Users_File";
       dbo          postgres    false    228    3267    217            �           2606    81866 #   Notifications fk_notifications_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Notifications"
    ADD CONSTRAINT fk_notifications_user FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 L   ALTER TABLE ONLY dbo."Notifications" DROP CONSTRAINT fk_notifications_user;
       dbo          postgres    false    228    231    3281            �           2606    16511     Request fk_request_assignedadmin    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Request"
    ADD CONSTRAINT fk_request_assignedadmin FOREIGN KEY ("AssignedAdminId") REFERENCES dbo."Admin"("AdminId") NOT VALID;
 I   ALTER TABLE ONLY dbo."Request" DROP CONSTRAINT fk_request_assignedadmin;
       dbo          postgres    false    215    221    3265            �           2606    16541    Request fk_request_member    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Request"
    ADD CONSTRAINT fk_request_member FOREIGN KEY ("RequestedById") REFERENCES dbo."Member"("MemberId") NOT VALID;
 B   ALTER TABLE ONLY dbo."Request" DROP CONSTRAINT fk_request_member;
       dbo          postgres    false    221    3269    219            �           2606    81995 +   SupportTickets fk_request_requestedbymember    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTickets"
    ADD CONSTRAINT fk_request_requestedbymember FOREIGN KEY ("RequestedByMemberId") REFERENCES dbo."Member"("MemberId") NOT VALID;
 T   ALTER TABLE ONLY dbo."SupportTickets" DROP CONSTRAINT fk_request_requestedbymember;
       dbo          postgres    false    3269    219    236            �           2606    16521 1   RequestRequirements fk_requestrequirement_request    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."RequestRequirements"
    ADD CONSTRAINT fk_requestrequirement_request FOREIGN KEY ("RequestTypeId") REFERENCES dbo."RequestType"("RequestTypeId");
 Z   ALTER TABLE ONLY dbo."RequestRequirements" DROP CONSTRAINT fk_requestrequirement_request;
       dbo          postgres    false    3276    224    222            �           2606    16526    Request fk_rquest_requestType    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Request"
    ADD CONSTRAINT "fk_rquest_requestType" FOREIGN KEY ("RequestTypeId") REFERENCES dbo."RequestType"("RequestTypeId") NOT VALID;
 H   ALTER TABLE ONLY dbo."Request" DROP CONSTRAINT "fk_rquest_requestType";
       dbo          postgres    false    224    221    3276            �           2606    81990 .   SupportTickets fk_supporttickets_assignedadmin    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTickets"
    ADD CONSTRAINT fk_supporttickets_assignedadmin FOREIGN KEY ("AssignedAdminId") REFERENCES dbo."Admin"("AdminId") NOT VALID;
 W   ALTER TABLE ONLY dbo."SupportTickets" DROP CONSTRAINT fk_supporttickets_assignedadmin;
       dbo          postgres    false    215    3265    236            �           2606    82023 7   SupportTicketConvo fk_supporttickets_supportticketconvo    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTicketConvo"
    ADD CONSTRAINT fk_supporttickets_supportticketconvo FOREIGN KEY ("SupportTicketId") REFERENCES dbo."SupportTickets"("SupportTicketId");
 `   ALTER TABLE ONLY dbo."SupportTicketConvo" DROP CONSTRAINT fk_supporttickets_supportticketconvo;
       dbo          postgres    false    236    237    3290            �           2606    82028 )   SupportTicketConvo fk_supporttickets_user    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."SupportTicketConvo"
    ADD CONSTRAINT fk_supporttickets_user FOREIGN KEY ("FromUserId") REFERENCES dbo."Users"("UserId");
 R   ALTER TABLE ONLY dbo."SupportTicketConvo" DROP CONSTRAINT fk_supporttickets_user;
       dbo          postgres    false    237    3281    228            }   %   x�3�4�tL���S ���F�&�f� `����� ��      �      x������ � �            x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �     x��R�N�0}Y�H��D��b]B���x����h��]Q ���@X"1θ�М��ܞ{z]D#�rNC��9�||����$&�IL��xzѣ������|��nNno�;]yI�GF�1*PP�@���ƶ�	�W�&T�aFUdwj��[��@��Y���A�$-t)�dI�Cn@��%�`��Ta��~t~��U�`�X��m���u�f��mlv<�_>��.p<]Ih�C��/�\gFihI��GT�Le��њ%��컥o۝�*[�ף��`�zU�Vе,��3%     