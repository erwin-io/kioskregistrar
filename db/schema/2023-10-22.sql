PGDMP     3    +            	    {            kioskregistrardb    15.2    15.2 (    1           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            2           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            3           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            4           1262    22779    kioskregistrardb    DATABASE     �   CREATE DATABASE kioskregistrardb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
     DROP DATABASE kioskregistrardb;
                postgres    false                        2615    22780    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            �            1255    22781    usp_reset() 	   PROCEDURE     �  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

	DELETE FROM dbo."Admin";
	DELETE FROM dbo."Member";
	DELETE FROM dbo."Users";
	
	ALTER SEQUENCE dbo."Admin_AdminId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Member_MemberId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Users_UserId_seq" RESTART WITH 1;
	
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
			'{"USERS", "DOCUMENT-TYPE"}');
	
	INSERT INTO dbo."Admin" (
		"UserId", 
		"FirstName", 
		"LastName",
		"MobileNumber")
	VALUES (
			1,
			'Admin',  
			'Admin',
			'123456');
	
END;
$_$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    6            �            1259    22813    Access    TABLE     �   CREATE TABLE dbo."Access" (
    "AccessId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."Access";
       dbo         heap    postgres    false    6            �            1259    22812    Access_AccessId_seq    SEQUENCE     �   ALTER TABLE dbo."Access" ALTER COLUMN "AccessId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Access_AccessId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    219            �            1259    22836    Admin    TABLE     �   CREATE TABLE dbo."Admin" (
    "AdminId" bigint NOT NULL,
    "UserId" bigint NOT NULL,
    "FirstName" character varying NOT NULL,
    "LastName" character varying NOT NULL,
    "MobileNumber" character varying NOT NULL
);
    DROP TABLE dbo."Admin";
       dbo         heap    postgres    false    6            �            1259    22835    Admin_AdminId_seq    SEQUENCE     �   ALTER TABLE dbo."Admin" ALTER COLUMN "AdminId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Admin_AdminId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    223    6            �            1259    22823    Files    TABLE     i   CREATE TABLE dbo."Files" (
    "FileId" bigint NOT NULL,
    "FileName" text NOT NULL,
    "Url" text
);
    DROP TABLE dbo."Files";
       dbo         heap    postgres    false    6            �            1259    22822    Files_FileId_seq    SEQUENCE     �   ALTER TABLE dbo."Files" ALTER COLUMN "FileId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Files_FileId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    221            �            1259    22851    Member    TABLE       CREATE TABLE dbo."Member" (
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
    "BirthCertFileId" bigint
);
    DROP TABLE dbo."Member";
       dbo         heap    postgres    false    6            �            1259    22850    Member_MemberId_seq    SEQUENCE     �   ALTER TABLE dbo."Member" ALTER COLUMN "MemberId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Member_MemberId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    225            �            1259    22789    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    6            �            1259    22794    Users    TABLE     �  CREATE TABLE dbo."Users" (
    "UserId" bigint NOT NULL,
    "UserName" character varying NOT NULL,
    "Password" character varying NOT NULL,
    "UserType" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL,
    "ProfileFileId" bigint,
    "AccessGranted" boolean DEFAULT false NOT NULL,
    "Access" character varying[] DEFAULT ARRAY[]::character varying[] NOT NULL
);
    DROP TABLE dbo."Users";
       dbo         heap    postgres    false    6            �            1259    22801    Users_UserId_seq    SEQUENCE     �   ALTER TABLE dbo."Users" ALTER COLUMN "UserId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Users_UserId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    216            (          0    22813    Access 
   TABLE DATA           =   COPY dbo."Access" ("AccessId", "Name", "Active") FROM stdin;
    dbo          postgres    false    219   {2       ,          0    22836    Admin 
   TABLE DATA           \   COPY dbo."Admin" ("AdminId", "UserId", "FirstName", "LastName", "MobileNumber") FROM stdin;
    dbo          postgres    false    223   �2       *          0    22823    Files 
   TABLE DATA           ;   COPY dbo."Files" ("FileId", "FileName", "Url") FROM stdin;
    dbo          postgres    false    221   �2       .          0    22851    Member 
   TABLE DATA           B  COPY dbo."Member" ("MemberId", "UserId", "FirstName", "MiddleName", "LastName", "Email", "MobileNumber", "BirthDate", "Address", "Gender", "CourseTaken", "Major", "IsAlumni", "SchoolYearLastAttended", "PrimarySchoolName", "PrimarySYGraduated", "SecondarySchoolName", "SecondarySYGraduated", "BirthCertFileId") FROM stdin;
    dbo          postgres    false    225   �2       $          0    22789    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    215   �3       %          0    22794    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "UserName", "Password", "UserType", "Active", "ProfileFileId", "AccessGranted", "Access") FROM stdin;
    dbo          postgres    false    216   �3       5           0    0    Access_AccessId_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('dbo."Access_AccessId_seq"', 1, false);
          dbo          postgres    false    218            6           0    0    Admin_AdminId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Admin_AdminId_seq"', 2, true);
          dbo          postgres    false    222            7           0    0    Files_FileId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Files_FileId_seq"', 1, false);
          dbo          postgres    false    220            8           0    0    Member_MemberId_seq    SEQUENCE SET     @   SELECT pg_catalog.setval('dbo."Member_MemberId_seq"', 1, true);
          dbo          postgres    false    224            9           0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 5, true);
          dbo          postgres    false    217            �           2606    22820    Access Access_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Access"
    ADD CONSTRAINT "Access_pkey" PRIMARY KEY ("AccessId");
 =   ALTER TABLE ONLY dbo."Access" DROP CONSTRAINT "Access_pkey";
       dbo            postgres    false    219            �           2606    22843    Admin Admin_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY dbo."Admin"
    ADD CONSTRAINT "Admin_pkey" PRIMARY KEY ("AdminId");
 ;   ALTER TABLE ONLY dbo."Admin" DROP CONSTRAINT "Admin_pkey";
       dbo            postgres    false    223            �           2606    22858    Member Member_pkey 
   CONSTRAINT     Y   ALTER TABLE ONLY dbo."Member"
    ADD CONSTRAINT "Member_pkey" PRIMARY KEY ("MemberId");
 =   ALTER TABLE ONLY dbo."Member" DROP CONSTRAINT "Member_pkey";
       dbo            postgres    false    225            �           2606    22805    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    215            �           2606    22829    Files pk_files_901578250 
   CONSTRAINT     [   ALTER TABLE ONLY dbo."Files"
    ADD CONSTRAINT pk_files_901578250 PRIMARY KEY ("FileId");
 A   ALTER TABLE ONLY dbo."Files" DROP CONSTRAINT pk_files_901578250;
       dbo            postgres    false    221            �           2606    22807    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    216            �           1259    22821    u_access    INDEX     e   CREATE UNIQUE INDEX u_access ON dbo."Access" USING btree ("Name", "Active") WHERE ("Active" = true);
    DROP INDEX dbo.u_access;
       dbo            postgres    false    219    219    219            �           1259    22809    u_user    INDEX     f   CREATE UNIQUE INDEX u_user ON dbo."Users" USING btree ("UserName", "Active") WHERE ("Active" = true);
    DROP INDEX dbo.u_user;
       dbo            postgres    false    216    216    216            �           2606    22844    Admin fk_Admin_User    FK CONSTRAINT     y   ALTER TABLE ONLY dbo."Admin"
    ADD CONSTRAINT "fk_Admin_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 >   ALTER TABLE ONLY dbo."Admin" DROP CONSTRAINT "fk_Admin_User";
       dbo          postgres    false    223    3207    216            �           2606    22864     Member fk_Member_BirthCertFileId    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Member"
    ADD CONSTRAINT "fk_Member_BirthCertFileId" FOREIGN KEY ("BirthCertFileId") REFERENCES dbo."Files"("FileId");
 K   ALTER TABLE ONLY dbo."Member" DROP CONSTRAINT "fk_Member_BirthCertFileId";
       dbo          postgres    false    221    225    3213            �           2606    22859    Member fk_Member_User    FK CONSTRAINT     {   ALTER TABLE ONLY dbo."Member"
    ADD CONSTRAINT "fk_Member_User" FOREIGN KEY ("UserId") REFERENCES dbo."Users"("UserId");
 @   ALTER TABLE ONLY dbo."Member" DROP CONSTRAINT "fk_Member_User";
       dbo          postgres    false    3207    216    225            �           2606    22830    Users fk_Users_File    FK CONSTRAINT     �   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT "fk_Users_File" FOREIGN KEY ("ProfileFileId") REFERENCES dbo."Files"("FileId") NOT VALID;
 >   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT "fk_Users_File";
       dbo          postgres    false    3213    216    221            (      x������ � �      ,   (   x�3�4�tL���3�Q�F�&�f\���(	����� \6>      *      x������ � �      .   �   x�E��
�0E痯��$���l%�`�n]%��B@��Mqp�p�=Õ��^��p�;J�n-���) �z����PM%E�M��^t����(wU�=�0S@n�nɘ޼�}Q�^!�8�L�.��i��ߖ�jo�C6Ԍ�/]p2�      $   !   x�s�s�w�wq�44261����� V:�      %   �   x�]�=S�0 ��9����
#iQ	�O-ׅ��+V0G���s���;>/�{w遬�de"��f�K�J�1B/R�W9�x�R�+I���#2΍0���
X.}
�78��%$N���(	�����"i ���#Q�{���mcf��}��U醂7E�ZL �%$jro������j�0����FC*���~�
�](ʮݟ�F�c�)3�>�>�f�;�[z;�{,�6�P��w}���$I?Y'S     