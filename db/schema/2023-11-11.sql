PGDMP     :    
            
    {            kioskregistrardb    15.4    15.4 7    W           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            X           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            Y           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            Z           1262    16398    kioskregistrardb    DATABASE     �   CREATE DATABASE kioskregistrardb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
     DROP DATABASE kioskregistrardb;
                postgres    false                        2615    16399    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            �            1255    16400    usp_reset() 	   PROCEDURE     �  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

	DELETE FROM dbo."Request";
	DELETE FROM dbo."RequestRequirements";
	DELETE FROM dbo."RequestType";
	DELETE FROM dbo."Admin";
	DELETE FROM dbo."Member";
	DELETE FROM dbo."Users";
	
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
		"FirstName", 
		"LastName",
		"FullName",
		"MobileNumber")
	VALUES (
			1,
			'000001',
			'Admin',  
			'Admin',
			'Admin Admin',
			'123456');
	
END;
$_$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    6            �            1259    16408    Admin    TABLE     s  CREATE TABLE dbo."Admin" (
    "AdminId" bigint NOT NULL,
    "UserId" bigint NOT NULL,
    "FirstName" character varying NOT NULL,
    "LastName" character varying NOT NULL,
    "MobileNumber" character varying NOT NULL,
    "FullName" character varying DEFAULT ''::character varying NOT NULL,
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
            dbo          postgres    false    215    6            �            1259    16415    Files    TABLE     i   CREATE TABLE dbo."Files" (
    "FileId" bigint NOT NULL,
    "FileName" text NOT NULL,
    "Url" text
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
            dbo          postgres    false    6    217            �            1259    16421    Member    TABLE     �  CREATE TABLE dbo."Member" (
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
    "FullName" character varying DEFAULT ''::character varying NOT NULL,
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
            dbo          postgres    false    219    6            �            1259    16429    Request    TABLE     �  CREATE TABLE dbo."Request" (
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
    "RAssignedDate" timestamp with time zone
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
            dbo          postgres    false    6    221            �            1259    16455    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    6            �            1259    16460    Users    TABLE     g  CREATE TABLE dbo."Users" (
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
       dbo         heap    postgres    false    6            �            1259    16468    Users_UserId_seq    SEQUENCE     �   ALTER TABLE dbo."Users" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    228            F          0    16408    Admin 
   TABLE DATA           u   COPY dbo."Admin" ("AdminId", "UserId", "FirstName", "LastName", "MobileNumber", "FullName", "AdminCode") FROM stdin;
    dbo          postgres    false    215   $S       H          0    16415    Files 
   TABLE DATA           ;   COPY dbo."Files" ("FileId", "FileName", "Url") FROM stdin;
    dbo          postgres    false    217   ZS       J          0    16421    Member 
   TABLE DATA           j  COPY dbo."Member" ("MemberId", "UserId", "FirstName", "MiddleName", "LastName", "Email", "MobileNumber", "BirthDate", "Address", "Gender", "CourseTaken", "Major", "IsAlumni", "SchoolYearLastAttended", "PrimarySchoolName", "PrimarySYGraduated", "SecondarySchoolName", "SecondarySYGraduated", "BirthCertFileId", "FullName", "IsVerified", "MemberCode") FROM stdin;
    dbo          postgres    false    219   wS       L          0    16429    Request 
   TABLE DATA           V  COPY dbo."Request" ("RequestId", "RequestedById", "RequestTypeId", "DateRequested", "AssignedAdminId", "DateAssigned", "DatePaid", "DateProcessStarted", "DateProcessEnd", "DateCompleted", "DateClosed", "DateLastUpdated", "RequestStatus", "Description", "RequestNo", "IsPaid", "IsReAssigned", "ReAssignedAdminId", "RAssignedDate") FROM stdin;
    dbo          postgres    false    221   �S       M          0    16436    RequestRequirements 
   TABLE DATA           �   COPY dbo."RequestRequirements" ("RequestRequirementsId", "Name", "RequestTypeId", "RequireToSubmitProof", "Active") FROM stdin;
    dbo          postgres    false    222   �S       O          0    16444    RequestType 
   TABLE DATA           u   COPY dbo."RequestType" ("RequestTypeId", "Name", "AuthorizeACopy", "Fee", "IsPaymentRequired", "Active") FROM stdin;
    dbo          postgres    false    224   �S       R          0    16455    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    227   �S       S          0    16460    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "UserName", "Password", "UserType", "Active", "ProfileFileId", "AccessGranted", "Access") FROM stdin;
    dbo          postgres    false    228   T       [           0    0    Admin_AdminId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Admin_AdminId_seq"', 1, true);
          dbo          postgres    false    216            \           0    0    Files_FileId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Files_FileId_seq"', 1, false);
          dbo          postgres    false    218            ]           0    0    Member_MemberId_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('dbo."Member_MemberId_seq"', 1, false);
          dbo          postgres    false    220            ^           0    0 -   RequestRequirements_RequestRequirementsId_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('dbo."RequestRequirements_RequestRequirementsId_seq"', 1, false);
          dbo          postgres    false    223            _           0    0    RequestType_RequestTypeId_seq    SEQUENCE SET     K   SELECT pg_catalog.setval('dbo."RequestType_RequestTypeId_seq"', 1, false);
          dbo          postgres    false    225            `           0    0    Request_RequestId_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('dbo."Request_RequestId_seq"', 1, false);
          dbo          postgres    false    226            a           0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 1, true);
          dbo          postgres    false    229            �           2606    16472    Admin Admin_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY dbo."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("AdminId");
 ;   ALTER TABLE ONLY dbo."Admin" DROP CONSTRAINT "Admin_pkey";
       dbo            postgres    false    215            �           2606    16474    Member Member_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Member"
    ADD CONSTRAINT "Member_pkey" PRIMARY KEY ("MemberId");
 =   ALTER TABLE ONLY dbo."Member" DROP CONSTRAINT "Member_pkey";
       dbo            postgres    false    219            �           2606    16476 ,   RequestRequirements RequestRequirements_pkey 
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
       dbo            postgres    false    221            �           2606    16482    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    227            �           2606    16484    Files pk_files_901578250 
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
       dbo          postgres    false    228    3246    215            �           2606    16496     Member fk_Member_BirthCertFileId    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Member"
    ADD CONSTRAINT "fk_Member_BirthCertFileId" FOREIGN KEY ("BirthCertFileId") REFERENCES dbo."Files"("FileId");
 K   ALTER TABLE ONLY dbo."Member" DROP CONSTRAINT "fk_Member_BirthCertFileId";
       dbo          postgres    false    3232    217    219            �           2606    16501    Member fk_Member_User    FK CONSTRAINT     {   ALTER TABLE ONLY dbo."Member"
    ADD CONSTRAINT "fk_Member_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 @   ALTER TABLE ONLY dbo."Member" DROP CONSTRAINT "fk_Member_User";
       dbo          postgres    false    3246    219    228            �           2606    16506    Users fk_Users_File    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT "fk_Users_File" FOREIGN KEY ("ProfileFileId") REFERENCES dbo."Files"("FileId") NOT VALID;
 >   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT "fk_Users_File";
       dbo          postgres    false    3232    228    217            �           2606    16511     Request fk_request_assignedadmin    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Request"
    ADD CONSTRAINT fk_request_assignedadmin FOREIGN KEY ("AssignedAdminId") REFERENCES dbo."Admin"("AdminId") NOT VALID;
 I   ALTER TABLE ONLY dbo."Request" DROP CONSTRAINT fk_request_assignedadmin;
       dbo          postgres    false    215    3230    221            �           2606    16541    Request fk_request_member    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Request"
    ADD CONSTRAINT fk_request_member FOREIGN KEY ("RequestedById") REFERENCES dbo."Member"("MemberId") NOT VALID;
 B   ALTER TABLE ONLY dbo."Request" DROP CONSTRAINT fk_request_member;
       dbo          postgres    false    221    3234    219            �           2606    16521 1   RequestRequirements fk_requestrequirement_request    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."RequestRequirements"
    ADD CONSTRAINT fk_requestrequirement_request FOREIGN KEY ("RequestTypeId") REFERENCES dbo."RequestType"("RequestTypeId");
 Z   ALTER TABLE ONLY dbo."RequestRequirements" DROP CONSTRAINT fk_requestrequirement_request;
       dbo          postgres    false    3241    222    224            �           2606    16526    Request fk_rquest_requestType    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Request"
    ADD CONSTRAINT "fk_rquest_requestType" FOREIGN KEY ("RequestTypeId") REFERENCES dbo."RequestType"("RequestTypeId") NOT VALID;
 H   ALTER TABLE ONLY dbo."Request" DROP CONSTRAINT "fk_rquest_requestType";
       dbo          postgres    false    3241    221    224            F   &   x�3�4�tL��̃��F�&�f�D� �b���� #~e      H      x������ � �      J      x������ � �      L      x������ � �      M      x������ � �      O      x������ � �      R      x������ � �      S     x���QO�0���_�4{$ *��.!2���x����h���P0�w7aa�Ĉq}hn�in���>b�����?�����e��INӈ>����G7K�⊉�;PJEѻ����t�5C�F�#����_�.0&��@��Pf� e:$�����V��.�)�4�����y��4����!+���֥�P(���E]n;?�:U0�-�`L�η��vgO��@�����ǳ����5�����,��I+S4���t���l�N)����Q�]����eY��     