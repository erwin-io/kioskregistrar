PGDMP     	            	    
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
    dbo          postgres    false    215   #S       H          0    16415    Files 
   TABLE DATA           ;   COPY dbo."Files" ("FileId", "FileName", "Url") FROM stdin;
    dbo          postgres    false    217   xS       J          0    16421    Member 
   TABLE DATA           j  COPY dbo."Member" ("MemberId", "UserId", "FirstName", "MiddleName", "LastName", "Email", "MobileNumber", "BirthDate", "Address", "Gender", "CourseTaken", "Major", "IsAlumni", "SchoolYearLastAttended", "PrimarySchoolName", "PrimarySYGraduated", "SecondarySchoolName", "SecondarySYGraduated", "BirthCertFileId", "FullName", "IsVerified", "MemberCode") FROM stdin;
    dbo          postgres    false    219   �S       L          0    16429    Request 
   TABLE DATA           V  COPY dbo."Request" ("RequestId", "RequestedById", "RequestTypeId", "DateRequested", "AssignedAdminId", "DateAssigned", "DatePaid", "DateProcessStarted", "DateProcessEnd", "DateCompleted", "DateClosed", "DateLastUpdated", "RequestStatus", "Description", "RequestNo", "IsPaid", "IsReAssigned", "ReAssignedAdminId", "RAssignedDate") FROM stdin;
    dbo          postgres    false    221   �\       M          0    16436    RequestRequirements 
   TABLE DATA           �   COPY dbo."RequestRequirements" ("RequestRequirementsId", "Name", "RequestTypeId", "RequireToSubmitProof", "Active") FROM stdin;
    dbo          postgres    false    222   �]       O          0    16444    RequestType 
   TABLE DATA           u   COPY dbo."RequestType" ("RequestTypeId", "Name", "AuthorizeACopy", "Fee", "IsPaymentRequired", "Active") FROM stdin;
    dbo          postgres    false    224   ^       R          0    16455    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    227   ;^       S          0    16460    Users 
   TABLE DATA           �   COPY dbo."Users" ("UserId", "UserName", "Password", "UserType", "Active", "ProfileFileId", "AccessGranted", "Access") FROM stdin;
    dbo          postgres    false    228   X^       [           0    0    Admin_AdminId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Admin_AdminId_seq"', 2, true);
          dbo          postgres    false    216            \           0    0    Files_FileId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Files_FileId_seq"', 1, false);
          dbo          postgres    false    218            ]           0    0    Member_MemberId_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('dbo."Member_MemberId_seq"', 83, true);
          dbo          postgres    false    220            ^           0    0 -   RequestRequirements_RequestRequirementsId_seq    SEQUENCE SET     [   SELECT pg_catalog.setval('dbo."RequestRequirements_RequestRequirementsId_seq"', 1, false);
          dbo          postgres    false    223            _           0    0    RequestType_RequestTypeId_seq    SEQUENCE SET     J   SELECT pg_catalog.setval('dbo."RequestType_RequestTypeId_seq"', 1, true);
          dbo          postgres    false    225            `           0    0    Request_RequestId_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('dbo."Request_RequestId_seq"', 4, true);
          dbo          postgres    false    226            a           0    0    Users_UserId_seq    SEQUENCE SET     >   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 85, true);
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
       dbo          postgres    false    3241    221    224            F   E   x�3�0�tL���3�Q���&ƆF�P!�qrB$�����������T��ܐ+F��� L�3      H      x������ � �      J   9	  x�͛ˎ����S�� ϕ�9F�@����FpY�.�3Y��Á��a���l����U�Q�'�����jK�����/_������}�߿��P��w߾���ϟ?&/����� J?���w��~������?��e����oRz7U1~k�?�����/�O{����?����q����%}�ۗWo�����������U~�M�O���.���_�s�4������[j�֨�׵�7j��Mk�K<�S-����u^д|���R�8��k����^�9�j�<n_�I��Y�,�(IS�����<�e�O�T���i|�8-g5��La/�u5��jn�6|�'}��s�4������Z���R�j5��B�xΧZ(ך��y���㬥�c�ȳj�m��%�󩖚�O_煒���������n\>#e�O�TM�==��/�S|z*���b�Z�3*ߴ�~�C~����R��[�OOE���j.��8-킇|*�eO�}��_Y��1����M� �'�gK }��_1��d��_8?1_,k��@�Jx��;�˼nZ ?�^4K��`��v�*z�r���E2'@=���D7�����[8�4/�)��r�|y%�FK?p|b�PfI�@q$�)^3%�U����*��1���%X��5Z�Ld�������ٚ�b�<҅xq�0^�Ǆ�v�r¸�ϔ�HY�n	Yd�"����\�/V]䩋\3���E]d�"����+�����ϐE���%�y,�)t����
#yu}��c���4R�44�H�q���U�ݤ��ь��4ݑZ���{��G�?�*�M�˳,��*O�G�I�itf($�C$�V�4��;��R���d�Fd`�*IpIZe��6+w��B�I�BI�i @a ���Fz�D�` 4�$'�P � h5 bw���������P��1C2W0"�w`���� ���� (�` �@m�eǙ3F  M��itg ��Vh\e?�<��p �@%��GÚR8@�Ծq������m��� u:@�YkR$M#i��iݬXx�]5�/�+r�3gZ���șF�9ӭi�֯s�e�Lgʴd�I�2��	R&k�ص�gN��R&3eҳ�1�-a�Ӕ�4��&�G��j�i�4Miy�Ӕ0M�i�f[Қ<w��}F��2]S<����5%\S���٘lT��MV�i�4M�,��)a�Ӕ�4U���"�a)�g��L�,�$�.���X�ܬ^2�l~��X���)����4%LS`���&�qy?�<c4�i�4M�,��)a�Ӕ��$k��vvX��4e��P����࿀���V������2�/5K�-���_V�W���� �30 � %�)�� 8�a �ٜ�C4�t3c�'����9���?o�({�t�� x �<:3� 8�a �1 m.��9�����?{f�[����mv4��&�����?[��)�H�!e������ú�!e6Sf-i4��"e���fE�YݯΜ�����̙y����˾xl�o<S���n�m[�3i6���`��i0M����@�n8��Ӵi���$L��4�i�i�jc@����i�4M�l��ia�Ӵ͚��I�]��`�L��i����3-<�������B���bn;�4m��Q���ia�Ӵ�J��n�����i�4M��J2���iL�6+�4T��cϴ�V��d�L�Tx����|L��cn��������a 
��:S�r�,���mY=)�����7��^왫�m�_'�ճZR�_��
���ڵ��RA��W˪I�l�r8.N�m���p���q>n�_5�$�5诠���w��w�v���I�<$KA�+��M��XgR�_'���RR�_��
����2��~ ^A��Wʬ��g8�����g���]�g0z�^ÚǿT�����L�p�q�{8�[A�:IS[�,n�RP�:�W������k	�hf͍SC�o���~[�~'&�,|.�������s����[�����h��Q�����������r�ÁqK��!ems��]��ss�Ղ���6�V�H�[��ܿm^�j��Y'��7����J����������������������={K�q�c\v�˾��ܻ��e���1*������a�b⍘��+�13;��x#fڿ{vK��������~��9�ߧ��e�a��%L�a2�9����u��c`2>M�5�$��{����}��g��ᤙ��}��KvN	� ��杆1g�� ���sv�-��w��W��u����a���>�&�=���ov��V��~�a���>��5{I�{���_��4��W2��I/���X��o+���W2�_��m��z�黜�����/      L   �   x���;O1��ܯ�j�yI��
�Ё�����/|)�6��&޾���D�fd����X�ԥ�جy�Ò���]@cW���e@�ې:*�2 Յ��zd����z�~y;��G�uI�L��DL<�Gg���x�`C`�n��Q ���{eg��7��H(mF֡N�/䩗�HT�%��3�<�k<�@�ɭ@�7"K�2<�KL��f����C�=]��}�]��F�����A������[W��O�L��AL�      M      x������ � �      O   %   x�3�J-,M-.Qp/JLI-�,�45 %\1z\\\ ��1      R      x������ � �      S      x���I��L���W���ZV �ṽ3H��3�r��[e�ɷ;>e��+oN�p�@�se>�B���5ͺ��h�W�+���1�D}�偵	��;��aȹz�٬��=�3oN�@�}G�x�qo������o��ǿ��_��`�'��t�Jn#eVCω�'���Df��^�ca3��z	E�7�#6\��?�?��O0�P:�&/G¨h�d�,�	&[W$s�,��	M!�ިK�[��??��O�i�wX��B���F_�a͝�yB[D�1�[<c��(N/��z럃ɟ`�'�����#u����"x(z�b=X(<˚�;U�
a�ky����9��	&�7�����u\�w�*1�dh�m٪��6;+I,4����z�u�9��	�~�YD@���RS<�s^<w��rB�sby$�'1�{�eM��cs#NƘ�	��A�ߊt�.�x�Z�}��}�]�t���9�?]�]���x��1�$3?ɖv7�Y��������*��1�v�x�G����hgX���r2���?���\���\G��L�2�!/�W,d������!�����I4
�?�u9�p��+��������z����mx{֕�;C5^#��j���x  �$҂R�'ոq���/O����g��ڻ^G$�~E%�Ty����$D AFW�W�>�FҨޡ��3���P����Ң0��Ԛv+6sO��A \]�FkW����"�d��~�=��0�ࡳF��2�3�j'�� �`h�F�������9�LbȊe;¼OI��?K��m����BBk��$8D DO8�����|�߶�jN��M��8�!���3�^4u,w��DP,�<P�[/�%���hO����5¸�����_�=�JxR��%ȫ�h`�����9w����]xS7˄��b��$��H�p�-�Nx'u����y��)�����H��H]�g�����jl��D����ndE�N��Fh\�ȍ����Ǳ�{/n�-S�M�?Y�]"N��s�ݺ��ٗ���I]�@#
4�����B���TF>E�O ����Y2�6/z����!���\��dA��@c'�]\�d����|�lx��h��o7Ξ�m�k����V��0��D�(�HL�[�A��e~�?v9�MB��ٍ"��J5�8aI����X>�Q��<���u�xi��oo�=vB�k�<]SNS%rNmǹqa�[D}R�(Ј�5TT8p2*b�=�-�翣�tx-./��mW�u����(����(Ј�^^ʎ�%�����5��EX]�a�t4�v��A��w!5�*\͓h�U7*s�hiU��H!L=]W�ve^W4��$Cԧ4�E˰ј�'Q��嶳sX�J����>�҄���D�Sm]�����0�f|�j­N*Q�Q���"v��R��y-2��g��?��{�s�Y�5[�ɻ�{���I]c@#4^��}W?}�1Je�0ӏZ����wq��+T��3���"rq���cĀFh�+z��ku�����	���T_�=n�I"5�U��D4Pm�~;ʓU1�ѝ�#i$���ݣ�A��)�k���w[;o�z�B1�)����ٙ~��`��S����N�ՋƎ������W�F�ކ4���7]�\��̽�hĀFhT_�������;���6wQ�l�⮘���t��WS!FU��N4b@#4��DA͏��>E�2�/�m��%���A�H]�y6&>{�@#4�U�=У�)��E�}��k^�O�'����E R�&�$|��0�Y]���!��%���AU��5'��K��2^��>���C�*6�T�_O:vhĀƖ*��<T64��_t���t%r^x�C�k�(��Z�̻&�o���hh�~k�a�>��qB]:0��2ʥB\���F����<b����4i\F'k#4�@#>,�l�<-�c�f$�zS���%r�.�������b�ޛ:Y�q�]E�7q��e�O��MS�9��G�t�=�PPjlg���I]�@#��S�e'�Z���Ru�NLYn��<}���&x�꽸U�LfD*�L��g�@#4���ȍ&>�����v�e�\[�+v]��Qc��~?�������R���-�AVT�.;v����tP+��5#�12��J.����+ԮQ=\�)��!8Ј���?a���U�vV��������P/m��1�=�9����ec�dS��8�x��ǔn�^e4��q�J�ʞ�ǉ��9n�Џ�δ����L�p�vN&UhāF)k.՜0	�8�3������~��ۂ��P*xլ���<8Hkng�4�@#�����
y�D�H�F�2��;���[�u��I��:6σo���pM �8���ۉ���՛�p;���g}Tpq�-�\������x���4���g�	@#4��pD���ã�{v�<5��e'�6Pi�����95��V>L���H ��by1������m3a�ڸ!���T-�.���"V[��g;h$��$6�>'
�mc-0Mʽ5䤢@�tq��F�w��+(7�Y8Y
�� ���E+I�d�C���)a�<\E�������H���d� ��h$��ّ����h���@+�dV5-�E0Z�4�W:;��ԙ��W������ӛ��7�l��\)�ȭ�"���ƘH��_�2b��b�-ŰQ��|2=@#�{m<�u�I%��P-5�BD�[��K6�^������{.D�����*h$~kd�"�En��/�Ģ��X���M�󳗋l��FO!��Y�G ����T�g\�I�6!jG��B�5�n�<��ώ���C�����wM��x{��;*�OD֎�o��P1?���:��Aٺ���l��-U���h$�Ƭuk����3X�p�j�)C�����T_��36��H{Һ�@#	4��]la�ƭb�QC�/�C>*�Ÿ�~yn���s`>��N�g�@#	4��ٙ��50(1'(�nA�|�.��m3�$.P����B�Y�]��2$�H���ߙI�5����,���&�P�Wt)�H�	o�a+�:��d#M�$�X\-�����>hW}4˴�>s�i�#�i�-4&Uq}���$�H������5E��	��o1������p��D�c��ݭ�/�Μ�!�����j�@�t�E���n頛Mlc
ǻ/q��PK�L�}�
��#kh$�F�j/�Z��.��{y���Q¤=W;Kn��}�Y?��sWN�kh$�FR�T2�:d�7krU��ջ'/JA��yw����>��h2qt]��d@(��Mꦬ��}V�k��)P�ݑ�];��J+}����9����I�N��،q��9��,�J>�<�̢���b���>�������$�N�����H�^}����a���3"n]���]��t�5�����z���<I��h����m�����M D~\����D��o�>��U~��SO⮷�A�Y4�H���!z�f[`	���q�z���ɡ^S�'eҤ�)��A��|���B����j���S�<8��
껗i�{�!R�2w�x���\Uw��&�$h��F|�~bd��<tM|�r��@���B�����H>,�Nr���t��H������Uە��z�.5����2��V��k��^ַ���b�N4R��� �(@��ӣ����g8�U�T&׋YlGCk5J�,%I�0z9iy��)�1���|�7����<�)^��m�G����T2���t���"���]�@#4�N���{0�MЦc��utY�?����������%�Ы�h��*><yL�>;凴���\��5�$>,?�m���0��#��?O4�@#4�X��?dN�/{Ǳ�0?2��c�{+u��'�Qnis0��|���4�H�����xu�^Gw�V��R��Đ(e��5�!����K�G��~��	4�@�'��D��ߍ����f����M!_.k�3��ew�c��K�{G�e9�7"���~R��]�V|��7�>BS��|[���W��ĺ.X���E��x��V���o����~����e��S��o��U����2 �   ���~���ʏ�WSU����������5�����:�������7����>�%~>�y�'ٟ�������e�$��ɤ����q���C�����){}�����[�}������O6�U���������a��w�~Ӿ�F�3���`:��qʆ�Ya������)��U�ƷR����]�V͘���_�����J98�?�ʦ�Y���/��8�     