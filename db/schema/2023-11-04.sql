PGDMP      6            
    {            kioskregistrardb    16.0    16.0 =               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    16492    kioskregistrardb    DATABASE     �   CREATE DATABASE kioskregistrardb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
     DROP DATABASE kioskregistrardb;
                postgres    false                        2615    16493    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            �            1255    16494    usp_reset() 	   PROCEDURE     �  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

	DELETE FROM dbo."Admin";
	DELETE FROM dbo."Member";
	DELETE FROM dbo."Users";
	DELETE FROM dbo."Request";
	DELETE FROM dbo."RequestRequirements";
	DELETE FROM dbo."RequestType";
	
	ALTER SEQUENCE dbo."Admin_AdminId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Member_MemberId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Users_UserId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Request_RequestId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."RequestRequirements_RequestRequirementsId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."RequestType_RequestTypeId_seq" RESTART WITH 1;
	
	INSERT INTO dbo."Users" (
		"UserName", 
		"Password", 
		"UserType",
		"AccessGranted",
		"Access")
	VALUES (
			'admin',
			'$2b$10$Ex.QfPaKaWM08yYOHQ2fwueVPUuT2M5PrASS.VPLs18gjBNPE/pxe',  
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
        "page": "Request Management",
        "view": true,
        "modify": true,
        "rights": [
          "Approval"
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
		"FirstName", 
		"LastName",
		"FullName",
		"MobileNumber")
	VALUES (
			1,
			'Admin',  
			'Admin',
			'Admin Admin',
			'123456');
	
END;
$_$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    6            �            1259    16495    Access    TABLE     �   CREATE TABLE dbo."Access" (
    "AccessId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."Access";
       dbo         heap    postgres    false    6            �            1259    16501    Access_AccessId_seq    SEQUENCE     �   ALTER TABLE dbo."Access" ALTER COLUMN "AccessId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Access_AccessId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    216            �            1259    16502    Admin    TABLE     )  CREATE TABLE dbo."Admin" (
    "AdminId" bigint NOT NULL,
    "UserId" bigint NOT NULL,
    "FirstName" character varying NOT NULL,
    "LastName" character varying NOT NULL,
    "MobileNumber" character varying NOT NULL,
    "FullName" character varying DEFAULT ''::character varying NOT NULL
);
    DROP TABLE dbo."Admin";
       dbo         heap    postgres    false    6            �            1259    16507    Admin_AdminId_seq    SEQUENCE     �   ALTER TABLE dbo."Admin" ALTER COLUMN "AdminId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Admin_AdminId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    218            �            1259    16508    Files    TABLE     i   CREATE TABLE dbo."Files" (
    "FileId" bigint NOT NULL,
    "FileName" text NOT NULL,
    "Url" text
);
    DROP TABLE dbo."Files";
       dbo         heap    postgres    false    6            �            1259    16513    Files_FileId_seq    SEQUENCE     �   ALTER TABLE dbo."Files" ALTER COLUMN "FileId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Files_FileId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    220            �            1259    16514    Member    TABLE     \  CREATE TABLE dbo."Member" (
    "MemberId" bigint NOT NULL,
    "UserId" bigint NOT NULL,
    "FirstName" character varying NOT NULL,
    "MiddleName" character varying,
    "LastName" character varying NOT NULL,
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
    "FullName" character varying DEFAULT ''::character varying NOT NULL
);
    DROP TABLE dbo."Member";
       dbo         heap    postgres    false    6            �            1259    16520    Member_MemberId_seq    SEQUENCE     �   ALTER TABLE dbo."Member" ALTER COLUMN "MemberId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Member_MemberId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    222    6            �            1259    16612    Request    TABLE     �  CREATE TABLE dbo."Request" (
    "RequestId" bigint NOT NULL,
    "MemberId" bigint NOT NULL,
    "RequestTypeId" bigint NOT NULL,
    "DateRequested" timestamp with time zone DEFAULT (now() AT TIME ZONE 'Asia/Manila'::text) NOT NULL,
    "AssignedAdminId" bigint NOT NULL,
    "DateAssigned" timestamp with time zone,
    "DatePaid" timestamp with time zone,
    "DateProcessStarted" timestamp with time zone,
    "DateProcessEnd" timestamp with time zone,
    "DateClaimed" timestamp with time zone,
    "DateClosed" timestamp with time zone,
    "DateLastUpdated" timestamp with time zone,
    "RequestStatus" character varying DEFAULT 'PENDING'::character varying NOT NULL,
    "Description" character varying NOT NULL
);
    DROP TABLE dbo."Request";
       dbo         heap    postgres    false    6            �            1259    16592    RequestRequirements    TABLE       CREATE TABLE dbo."RequestRequirements" (
    "RequestRequirementsId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "RequestTypeId" bigint NOT NULL,
    "RequireToSubmitProof" boolean DEFAULT false NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
 &   DROP TABLE dbo."RequestRequirements";
       dbo         heap    postgres    false    6            �            1259    16591 -   RequestRequirements_RequestRequirementsId_seq    SEQUENCE       ALTER TABLE dbo."RequestRequirements" ALTER COLUMN "RequestRequirementsId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."RequestRequirements_RequestRequirementsId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    230            �            1259    16580    RequestType    TABLE     .  CREATE TABLE dbo."RequestType" (
    "RequestTypeId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "AuthorizeACopy" boolean DEFAULT false NOT NULL,
    "Fee" numeric DEFAULT 0 NOT NULL,
    "IsPaymentRequired" boolean DEFAULT false NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."RequestType";
       dbo         heap    postgres    false    6            �            1259    16579    RequestType_RequestTypeId_seq    SEQUENCE     �   ALTER TABLE dbo."RequestType" ALTER COLUMN "RequestTypeId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."RequestType_RequestTypeId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    228    6            �            1259    16611    Request_RequestId_seq    SEQUENCE     �   ALTER TABLE dbo."Request" ALTER COLUMN "RequestId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Request_RequestId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    232            �            1259    16521    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    6            �            1259    16526    Users    TABLE     g  CREATE TABLE dbo."Users" (
    "UserId" bigint NOT NULL,
    "UserName" character varying NOT NULL,
    "Password" character varying NOT NULL,
    "UserType" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "ProfileFileId" bigint,
    "AccessGranted" boolean DEFAULT false NOT NULL,
    "Access" json DEFAULT '[]'::json NOT NULL
);
    DROP TABLE dbo."Users";
       dbo         heap    postgres    false    6            �            1259    16534    Users_UserId_seq    SEQUENCE     �   ALTER TABLE dbo."Users" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    225    6            �          0    16495    Access 
   TABLE DATA           =   COPY dbo."Access" ("AccessId", "Name", "Active") FROM stdin;
    dbo          postgres    false    216   QW                 0    16502    Admin 
   TABLE DATA           h   COPY dbo."Admin" ("AdminId", "UserId", "FirstName", "LastName", "MobileNumber", "FullName") FROM stdin;
    dbo          postgres    false    218   nW                 0    16508    Files 
   TABLE DATA           ;   COPY dbo."Files" ("FileId", "FileName", "Url") FROM stdin;
    dbo          postgres    false    220   �W                 0    16514    Member 
   TABLE DATA           N  COPY dbo."Member" ("MemberId", "UserId", "FirstName", "MiddleName", "LastName", "Email", "MobileNumber", "BirthDate", "Address", "Gender", "CourseTaken", "Major", "IsAlumni", "SchoolYearLastAttended", "PrimarySchoolName", "PrimarySYGraduated", "SecondarySchoolName", "SecondarySYGraduated", "BirthCertFileId", "FullName") FROM stdin;
    dbo          postgres    false    222   �W                 0    16612    Request 
   TABLE DATA             COPY dbo."Request" ("RequestId", "MemberId", "RequestTypeId", "DateRequested", "AssignedAdminId", "DateAssigned", "DatePaid", "DateProcessStarted", "DateProcessEnd", "DateClaimed", "DateClosed", "DateLastUpdated", "RequestStatus", "Description") FROM stdin;
    dbo          postgres    false    232   �W                 0    16592    RequestRequirements 
   TABLE DATA           �   COPY dbo."RequestRequirements" ("RequestRequirementsId", "Name", "RequestTypeId", "RequireToSubmitProof", "Active") FROM stdin;
    dbo          postgres    false    230   �W                 0    16580    RequestType 
   TABLE DATA           u   COPY dbo."RequestType" ("RequestTypeId", "Name", "AuthorizeACopy", "Fee", "IsPaymentRequired", "Active") FROM stdin;
    dbo          postgres    false    228   X                 0    16521    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    224   2X                 0    16526    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "UserName", "Password", "UserType", "Active", "ProfileFileId", "AccessGranted", "Access") FROM stdin;
    dbo          postgres    false    225   cX                  0    0    Access_AccessId_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('dbo."Access_AccessId_seq"', 1, false);
          dbo          postgres    false    217                       0    0    Admin_AdminId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Admin_AdminId_seq"', 1, true);
          dbo          postgres    false    219                       0    0    Files_FileId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Files_FileId_seq"', 1, false);
          dbo          postgres    false    221                       0    0    Member_MemberId_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('dbo."Member_MemberId_seq"', 1, false);
          dbo          postgres    false    223                       0    0 -   RequestRequirements_RequestRequirementsId_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('dbo."RequestRequirements_RequestRequirementsId_seq"', 1, false);
          dbo          postgres    false    229                       0    0    RequestType_RequestTypeId_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('dbo."RequestType_RequestTypeId_seq"', 1, false);
          dbo          postgres    false    227                       0    0    Request_RequestId_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('dbo."Request_RequestId_seq"', 1, false);
          dbo          postgres    false    231                       0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 1, true);
          dbo          postgres    false    226            S           2606    16536    Access Access_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Access"
    ADD CONSTRAINT "Access_pkey" PRIMARY KEY ("AccessId");
 =   ALTER TABLE ONLY dbo."Access" DROP CONSTRAINT "Access_pkey";
       dbo            postgres    false    216            V           2606    16538    Admin Admin_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY dbo."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("AdminId");
 ;   ALTER TABLE ONLY dbo."Admin" DROP CONSTRAINT "Admin_pkey";
       dbo            postgres    false    218            Z           2606    16540    Member Member_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Member"
    ADD CONSTRAINT "Member_pkey" PRIMARY KEY ("MemberId");
 =   ALTER TABLE ONLY dbo."Member" DROP CONSTRAINT "Member_pkey";
       dbo            postgres    false    222            d           2606    16600 ,   RequestRequirements RequestRequirements_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY dbo."RequestRequirements"
    ADD CONSTRAINT "RequestRequirements_pkey" PRIMARY KEY ("RequestRequirementsId");
 W   ALTER TABLE ONLY dbo."RequestRequirements" DROP CONSTRAINT "RequestRequirements_pkey";
       dbo            postgres    false    230            a           2606    16590    RequestType RequestType_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY dbo."RequestType"
    ADD CONSTRAINT "RequestType_pkey" PRIMARY KEY ("RequestTypeId");
 G   ALTER TABLE ONLY dbo."RequestType" DROP CONSTRAINT "RequestType_pkey";
       dbo            postgres    false    228            g           2606    16620    Request Request_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Request"
    ADD CONSTRAINT "Request_pkey" PRIMARY KEY ("RequestId");
 ?   ALTER TABLE ONLY dbo."Request" DROP CONSTRAINT "Request_pkey";
       dbo            postgres    false    232            \           2606    16542    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    224            X           2606    16544    Files pk_files_901578250 
   CONSTRAINT     [   ALTER TABLE ONLY dbo."Files"
    ADD CONSTRAINT pk_files_901578250 PRIMARY KEY ("FileId");
 A   ALTER TABLE ONLY dbo."Files" DROP CONSTRAINT pk_files_901578250;
       dbo            postgres    false    220            ^           2606    16546    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    225            T           1259    16547    u_access    INDEX     e   CREATE UNIQUE INDEX u_access ON dbo."Access" USING btree ("Name", "Active") WHERE ("Active" = true);
    DROP INDEX dbo.u_access;
       dbo            postgres    false    216    216    216            e           1259    16657    u_requestRequirement    INDEX     �   CREATE UNIQUE INDEX "u_requestRequirement" ON dbo."RequestRequirements" USING btree ("Name", "RequestTypeId", "Active") WITH (deduplicate_items='true') WHERE ("Active" = true);
 '   DROP INDEX dbo."u_requestRequirement";
       dbo            postgres    false    230    230    230    230            b           1259    16621    u_requestType    INDEX     �   CREATE UNIQUE INDEX "u_requestType" ON dbo."RequestType" USING btree ("Name", "Active") WITH (deduplicate_items='true') WHERE ("Active" = true);
     DROP INDEX dbo."u_requestType";
       dbo            postgres    false    228    228    228            _           1259    16548    u_user    INDEX     f   CREATE UNIQUE INDEX u_user ON dbo."Users" USING btree ("UserName", "Active") WHERE ("Active" = true);
    DROP INDEX dbo.u_user;
       dbo            postgres    false    225    225    225            h           2606    16549    Admin fk_Admin_User    FK CONSTRAINT     y   ALTER TABLE ONLY dbo."Admin"
    ADD CONSTRAINT "fk_Admin_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 >   ALTER TABLE ONLY dbo."Admin" DROP CONSTRAINT "fk_Admin_User";
       dbo          postgres    false    225    4702    218            i           2606    16554     Member fk_Member_BirthCertFileId    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Member"
    ADD CONSTRAINT "fk_Member_BirthCertFileId" FOREIGN KEY ("BirthCertFileId") REFERENCES dbo."Files"("FileId");
 K   ALTER TABLE ONLY dbo."Member" DROP CONSTRAINT "fk_Member_BirthCertFileId";
       dbo          postgres    false    220    222    4696            j           2606    16559    Member fk_Member_User    FK CONSTRAINT     {   ALTER TABLE ONLY dbo."Member"
    ADD CONSTRAINT "fk_Member_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 @   ALTER TABLE ONLY dbo."Member" DROP CONSTRAINT "fk_Member_User";
       dbo          postgres    false    4702    222    225            k           2606    16564    Users fk_Users_File    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT "fk_Users_File" FOREIGN KEY ("ProfileFileId") REFERENCES dbo."Files"("FileId") NOT VALID;
 >   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT "fk_Users_File";
       dbo          postgres    false    225    4696    220            m           2606    16652     Request fk_request_assignedadmin    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Request"
    ADD CONSTRAINT fk_request_assignedadmin FOREIGN KEY ("AssignedAdminId") REFERENCES dbo."Admin"("AdminId") NOT VALID;
 I   ALTER TABLE ONLY dbo."Request" DROP CONSTRAINT fk_request_assignedadmin;
       dbo          postgres    false    218    4694    232            n           2606    16647    Request fk_request_member    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Request"
    ADD CONSTRAINT fk_request_member FOREIGN KEY ("MemberId") REFERENCES dbo."Member"("MemberId") NOT VALID;
 B   ALTER TABLE ONLY dbo."Request" DROP CONSTRAINT fk_request_member;
       dbo          postgres    false    232    222    4698            l           2606    16601 1   RequestRequirements fk_requestrequirement_request    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."RequestRequirements"
    ADD CONSTRAINT fk_requestrequirement_request FOREIGN KEY ("RequestTypeId") REFERENCES dbo."RequestType"("RequestTypeId");
 Z   ALTER TABLE ONLY dbo."RequestRequirements" DROP CONSTRAINT fk_requestrequirement_request;
       dbo          postgres    false    230    228    4705            o           2606    16642    Request fk_rquest_requestType    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Request"
    ADD CONSTRAINT "fk_rquest_requestType" FOREIGN KEY ("RequestTypeId") REFERENCES dbo."RequestType"("RequestTypeId") NOT VALID;
 H   ALTER TABLE ONLY dbo."Request" DROP CONSTRAINT "fk_rquest_requestType";
       dbo          postgres    false    4705    228    232            �      x������ � �         #   x�3�4�tL��̃��F�&�f������� Մ
;            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �         !   x�s�s�w�wq�44261����� V:�           x�ŒQK�0���_JG]�𭲁����Y����]Ķ1i��/u++(��b��p���8�E)ϐ冖ӷF[{Sv�IP=�]M�xS>�S��S���=���$ϗc::[@ސ\�Q��z��XoM��)X�6�L�����5��vYB[N�����ɪPژE-��k	�h�֪_
���<���|�}����`�\�R]�z�:�o؟=�@��+�^zO+]�KH!�M$a�V�&�LQ�����|����|�ba�a;2��     