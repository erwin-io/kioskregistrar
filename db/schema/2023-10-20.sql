PGDMP                     	    {            kioskregistrardb    15.2    15.2                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    22779    kioskregistrardb    DATABASE     �   CREATE DATABASE kioskregistrardb WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
     DROP DATABASE kioskregistrardb;
                postgres    false                        2615    22780    dbo    SCHEMA        CREATE SCHEMA dbo;
    DROP SCHEMA dbo;
                postgres    false            �            1255    22781    usp_reset() 	   PROCEDURE     �  CREATE PROCEDURE dbo.usp_reset()
    LANGUAGE plpgsql
    AS $_$
begin

	DELETE FROM dbo."Users";
	DELETE FROM dbo."Roles";
	
	ALTER SEQUENCE dbo."Users_UserId_seq" RESTART WITH 1;
	ALTER SEQUENCE dbo."Roles_RoleId_seq" RESTART WITH 1;
	
	INSERT INTO dbo."Users" (
		"MobileNumber", 
		"Password", 
		"Name", 
		"UserType")
	VALUES (
			'123456',
			'$2b$10$GOTc5SBq83YG4Z90tzwlFOmmzJMPdnZmJwzlzyqO5UlWsw5m76zJq', 
			'Admin',  
			'ADMIN');
	
	INSERT INTO dbo."Roles" ("Name")
	VALUES ('ADMIN');
END;
$_$;
     DROP PROCEDURE dbo.usp_reset();
       dbo          postgres    false    6            �            1259    22782    Roles    TABLE     �   CREATE TABLE dbo."Roles" (
    "RoleId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
);
    DROP TABLE dbo."Roles";
       dbo         heap    postgres    false    6            �            1259    22788    Roles_RoleId_seq    SEQUENCE     �   ALTER TABLE dbo."Roles" ALTER COLUMN "RoleId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME dbo."Roles_RoleId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            dbo          postgres    false    6    215            �            1259    22789    SystemConfig    TABLE     r   CREATE TABLE dbo."SystemConfig" (
    "Key" character varying NOT NULL,
    "Value" character varying NOT NULL
);
    DROP TABLE dbo."SystemConfig";
       dbo         heap    postgres    false    6            �            1259    22794    Users    TABLE     L  CREATE TABLE dbo."Users" (
    "UserId" bigint NOT NULL,
    "Name" character varying NOT NULL,
    "MobileNumber" character varying NOT NULL,
    "Password" character varying NOT NULL,
    "UserType" character varying NOT NULL,
    "Roles" bigint[] DEFAULT ARRAY[]::bigint[] NOT NULL,
    "Active" boolean DEFAULT true NOT NULL
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
            dbo          postgres    false    6    218            	          0    22782    Roles 
   TABLE DATA           :   COPY dbo."Roles" ("RoleId", "Name", "Active") FROM stdin;
    dbo          postgres    false    215   �                 0    22789    SystemConfig 
   TABLE DATA           5   COPY dbo."SystemConfig" ("Key", "Value") FROM stdin;
    dbo          postgres    false    217   �                 0    22794    Users 
   TABLE DATA           k   COPY dbo."Users" ("UserId", "Name", "MobileNumber", "Password", "UserType", "Roles", "Active") FROM stdin;
    dbo          postgres    false    218   �                  0    0    Roles_RoleId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Roles_RoleId_seq"', 1, true);
          dbo          postgres    false    216                       0    0    Users_UserId_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('dbo."Users_UserId_seq"', 2, true);
          dbo          postgres    false    219            t           2606    22803    Roles Roles_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY dbo."Roles"
    ADD CONSTRAINT "Roles_pkey" PRIMARY KEY ("RoleId");
 ;   ALTER TABLE ONLY dbo."Roles" DROP CONSTRAINT "Roles_pkey";
       dbo            postgres    false    215            w           2606    22805    SystemConfig SystemConfig_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY dbo."SystemConfig"
    ADD CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("Key");
 I   ALTER TABLE ONLY dbo."SystemConfig" DROP CONSTRAINT "SystemConfig_pkey";
       dbo            postgres    false    217            y           2606    22807    Users pk_users_1557580587 
   CONSTRAINT     \   ALTER TABLE ONLY dbo."Users"
    ADD CONSTRAINT pk_users_1557580587 PRIMARY KEY ("UserId");
 B   ALTER TABLE ONLY dbo."Users" DROP CONSTRAINT pk_users_1557580587;
       dbo            postgres    false    218            u           1259    22808    u_role    INDEX     b   CREATE UNIQUE INDEX u_role ON dbo."Roles" USING btree ("Name", "Active") WHERE ("Active" = true);
    DROP INDEX dbo.u_role;
       dbo            postgres    false    215    215    215            z           1259    22809    u_user    INDEX     j   CREATE UNIQUE INDEX u_user ON dbo."Users" USING btree ("MobileNumber", "Active") WHERE ("Active" = true);
    DROP INDEX dbo.u_user;
       dbo            postgres    false    218    218    218            	      x�3�tt����,����� @�         !   x�s�s�w�wq�44261����� V:�         �   x�5���@ ���S8tf�v��U�Raj\T�4�fR�5����^��`^���NAř�!���F���CRur�������N�;�J���c;PaL�����V[x�S0����G�Y�w.�&ED�02�!{Z7�������;�3޷�4'��N�כk��͂���{�g{��i�(���9�     